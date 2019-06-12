/*
 * Copyright 2019 HERMENEUT Consortium
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.service.impl.result;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AttackMap;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.result.Result;
import eu.hermeneut.service.*;
import eu.hermeneut.service.result.ResultService;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import eu.hermeneut.utils.likelihood.overall.OverallCalculator;
import eu.hermeneut.utils.threatagent.ThreatAgentComparator;
import eu.hermeneut.web.rest.AssetResource;
import org.apache.commons.math3.util.Precision;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class ResultServiceImpl implements ResultService {
    private final Logger log = LoggerFactory.getLogger(AssetResource.class);

    @Autowired
    private CompanyProfileService companyProfileService;

    @Autowired
    private ThreatAgentService threatAgentService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private MyAnswerService myAnswerService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AnswerService answerService;

    @Autowired
    private AttackStrategyCalculator attackStrategyCalculator;

    @Autowired
    private OverallCalculator overallCalculator;

    @Override
    public Result getThreatAgentsResult(Long companyProfileID) {
        log.debug("REST request to get the RESULT");
        log.debug("CompanyProfileID: " + companyProfileID);

        Result result = new Result();

        //#1 fetch the CompanyProfile
        CompanyProfile companyProfile = this.companyProfileService.findOne(companyProfileID);

        if (companyProfile != null) {
            //Get

            //#2 Calculate the identified threat agents from the MyAnswers
            Set<ThreatAgent> threatAgentSet = this.getThreatAgents(companyProfileID);
            log.debug("ThreatAgents: " + Arrays.toString(threatAgentSet.toArray()));

            if (threatAgentSet != null && !threatAgentSet.isEmpty()) {
                List<ThreatAgent> ascendingThreatAgentSkills = new ArrayList<>(threatAgentSet);
                ascendingThreatAgentSkills.sort(new ThreatAgentComparator().reversed());

                for (ThreatAgent threatAgent : ascendingThreatAgentSkills) {
                    log.debug("Skills: " + threatAgent.getSkillLevel().getValue());
                }

                Map<Long, Float> levelsOfInterest = this.getLevelsOfInterest(companyProfileID);

                ThreatAgent strongestThreatAgent = ascendingThreatAgentSkills.get(0);
                log.debug("Strongest ThreatAgent: " + strongestThreatAgent);

                List<AttackStrategy> attackStrategies = this.attackStrategyService.findAll();
                log.debug("AttackStrategies: " + Arrays.toString(attackStrategies.toArray()));

                //Map used to update the likelihood of an AttackStrategy in time O(1).
                Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap = attackStrategies.stream().collect(Collectors.toMap(AttackStrategy::getId, attackStrategy -> new AugmentedAttackStrategy(attackStrategy)));

                //Set the Initial Likelihood for the AttackStrategies
                for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {
                    AugmentedAttackStrategy attackStrategy = entry.getValue();
                    attackStrategy.setInitialLikelihood(this.attackStrategyCalculator.initialLikelihood(attackStrategy).getValue());
                }

                log.debug("BEGIN ############AttackMap############...");
                AttackMap attackMap = new AttackMap(augmentedAttackStrategyMap);
                log.debug("size: " + attackMap.size());
                log.debug(attackMap.toString());
                log.debug("END ############AttackMap############...");

                //#Output 1 ==> OVERALL INITIAL LIKELIHOOD
                result.setInitialVulnerability(new HashMap<Long, Float>() {
                    {
                        for (ThreatAgent threatAgent : ascendingThreatAgentSkills) {
                            log.debug("Skills: " + threatAgent.getSkillLevel().getValue());
                            float levelOfInterest = levelsOfInterest.getOrDefault(threatAgent.getId(), 0F);

                            put(threatAgent.getId(), Precision.round(levelOfInterest * ResultServiceImpl.this.overallCalculator.overallInitialLikelihoodByThreatAgent(threatAgent, attackMap), 2));
                        }
                    }
                });

                //#4 get the questionnaireStatuses by CISO and EXTERNAL_AUDIT
                List<QuestionnaireStatus> questionnaireStatuses = this.questionnaireStatusService.findAllByCompanyProfile(companyProfile.getId());

                QuestionnaireStatus cisoQuestionnaireStatus = questionnaireStatuses.stream().filter(questionnaireStatus -> {
                    return questionnaireStatus.getQuestionnaire().getPurpose().equals(QuestionnairePurpose.SELFASSESSMENT) && questionnaireStatus.getRole() == Role.ROLE_CISO;
                }).findFirst().orElse(null);

                QuestionnaireStatus externalAuditQuestionnaireStatus = questionnaireStatuses.stream().filter(questionnaireStatus -> {
                    return questionnaireStatus.getQuestionnaire().getPurpose().equals(QuestionnairePurpose.SELFASSESSMENT) && questionnaireStatus.getRole() == Role.ROLE_EXTERNAL_AUDIT;
                }).findFirst().orElse(null);

                //#5 Turn CISO myAnswers to ContextualLikelihoods
                if (cisoQuestionnaireStatus != null) {
                    Questionnaire questionnaire = cisoQuestionnaireStatus.getQuestionnaire();
                    List<Question> questions = this.questionService.findAllByQuestionnaire(questionnaire);
                    List<Answer> answers = this.answerService.findAll();
                    Map<Long/*AnswerID*/, Answer> answersMap = answers.stream().collect(Collectors.toMap(Answer::getId, Function.identity()));
                    Map<Long/*QuestionID*/, Question> questionsMap = questions.stream().collect(Collectors.toMap(Question::getId, Function.identity()));

                    List<MyAnswer> myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(cisoQuestionnaireStatus.getId());

                    this.attackStrategyCalculator.calculateContextualVulnerabilityLikelihoodAndCriticalities(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);

                    //#Output 2 ==> OVERALL CONTEXTUAL LIKELIHOOD
                    result.setContextualVulnerability(new HashMap<Long, Float>() {
                        {
                            for (ThreatAgent threatAgent : ascendingThreatAgentSkills) {
                                float levelOfInterest = levelsOfInterest.getOrDefault(threatAgent.getId(), 0F);
                                put(threatAgent.getId(), Precision.round(levelOfInterest * ResultServiceImpl.this.overallCalculator.overallContextualLikelihoodByThreatAgent(threatAgent, attackMap), 2));
                            }
                        }
                    });
                } else {
                    result.setContextualVulnerability(new HashMap<>());
                }

                //#6 Turn ExternalAudit MyAnswers to RefinedLikelihoods
                if (externalAuditQuestionnaireStatus != null) {
                    Questionnaire questionnaire = externalAuditQuestionnaireStatus.getQuestionnaire();
                    List<Question> questions = this.questionService.findAllByQuestionnaire(questionnaire);
                    List<Answer> answers = this.answerService.findAll();
                    Map<Long/*AnswerID*/, Answer> answersMap = answers.stream().collect(Collectors.toMap(Answer::getId, Function.identity()));
                    Map<Long/*QuestionID*/, Question> questionsMap = questions.stream().collect(Collectors.toMap(Question::getId, Function.identity()));

                    List<MyAnswer> myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(externalAuditQuestionnaireStatus.getId());

                    //Group the MyAnswers by AttackStrategy and find the likelihood for each of them.
                    Map<AugmentedAttackStrategy, Set<MyAnswer>> attackAnswersMap = new HashMap<>();

                    this.attackStrategyCalculator.calculateRefinedVulnerabilityLikelihoodAndCriticalities(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);

                    //#Output 3 ==> OVERALL REFINED LIKELIHOOD
                    result.setRefinedVulnerability(new HashMap<Long, Float>() {
                        {
                            for (ThreatAgent threatAgent : ascendingThreatAgentSkills) {
                                float levelOfInterest = levelsOfInterest.getOrDefault(threatAgent.getId(), 0F);
                                put(threatAgent.getId(), Precision.round(levelOfInterest * ResultServiceImpl.this.overallCalculator.overallRefinedLikelihoodByThreatAgent(threatAgent, attackMap), 2));
                            }
                        }
                    });
                } else {
                    result.setRefinedVulnerability(new HashMap<>());
                }
            }
        } else {

        }

        return result;
    }

    @Override
    public Float getOverallLikelihood(Long companyProfileID) {
        Float overallLikelihood = -1F;

        if (companyProfileID != null) {
            Result result = this.getThreatAgentsResult(companyProfileID);

            if (result != null) {
                Map<Long, Float> initialVulnerability = result.getInitialVulnerability();
                Map<Long, Float> contextualVulnerability = result.getContextualVulnerability();
                Map<Long, Float> refinedVulnerability = result.getRefinedVulnerability();

                if (refinedVulnerability != null && !refinedVulnerability.isEmpty()) {
                    overallLikelihood = Collections.max(refinedVulnerability.entrySet(), Comparator.comparingDouble(Map.Entry::getValue)).getValue();
                } else if (contextualVulnerability != null && !contextualVulnerability.isEmpty()) {
                    overallLikelihood = Collections.max(contextualVulnerability.entrySet(), Comparator.comparingDouble(Map.Entry::getValue)).getValue();
                } else if (initialVulnerability != null && !initialVulnerability.isEmpty()) {
                    overallLikelihood = Collections.max(initialVulnerability.entrySet(), Comparator.comparingDouble(Map.Entry::getValue)).getValue();
                }
            }
        }

        return overallLikelihood;
    }

    @Override
    public Map<Long/*ThreatAgentID*/, Float/*LevelOfInterest*/> getLevelsOfInterest(Long companyProfileID) {
        //ThreatAgent-ID --> x-Value
        Map<Long, Integer> threatAgentQuestionsCount = new HashMap<>();
        Map<Long, Integer> threatAgentYesCount = new HashMap<>();
        Map<Long, Float> threatAgentLevelsOfInterest = new HashMap<>();

        if (companyProfileID != null) {
            CompanyProfile companyProfile = this.companyProfileService.findOne(companyProfileID);

            if (companyProfile != null) {
                QuestionnaireStatus questionnaireStatus = this.questionnaireStatusService.findAllByCompanyProfileRoleAndQuestionnairePurpose(companyProfileID, Role.ROLE_CISO, QuestionnairePurpose.ID_THREAT_AGENT).stream().findFirst().orElse(null);;

                if (questionnaireStatus != null) {
                    List<MyAnswer> myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(questionnaireStatus.getId());

                    for (MyAnswer myAnswer : myAnswers) {
                        Question question = myAnswer.getQuestion();
                        ThreatAgent threatAgent = question.getThreatAgent();
                        Answer answer = myAnswer.getAnswer();

                        if (question != null && threatAgent != null && answer != null) {
                            //Count the question
                            this.initOrIncrement(threatAgentQuestionsCount, threatAgent);

                            //Count the YES answers
                            if (answer.getName().equals("Yes")) {
                                this.initOrIncrement(threatAgentYesCount, threatAgent);
                            }
                        }
                    }

                    //Calculate the Level of Interest
                    threatAgentQuestionsCount.keySet().stream().forEach(threatAgentID -> {
                        float questionsCount = threatAgentQuestionsCount.getOrDefault(threatAgentID, 0);
                        float yesCount = threatAgentYesCount.getOrDefault(threatAgentID, 0);
                        float levelOfInterest = questionsCount != 0F ? Precision.round(yesCount / questionsCount, 2) : 0F;

                        threatAgentLevelsOfInterest.put(threatAgentID, levelOfInterest);
                    });
                }
            }
        }

        //Add the threat agents identified by default with Level of Interest = 100%
        List<ThreatAgent> defaultThreatAgents = this.threatAgentService.findAllDefault();

        if (defaultThreatAgents != null && !defaultThreatAgents.isEmpty()) {
            defaultThreatAgents.stream().forEach((threatAgent) -> {
                if (threatAgent.isIdentifiedByDefault()) {
                    threatAgentLevelsOfInterest.put(threatAgent.getId(), 1F);
                }
            });
        }

        return threatAgentLevelsOfInterest;
    }

    @Override
    public Set<ThreatAgent> getThreatAgents(Long companyProfileID) {
        //Get the levels of interest
        Map<Long/*ThreatAgentID*/, Float/*LevelOfInterest*/> levelOfInterests = this.getLevelsOfInterest(companyProfileID);

        //Fetch all threat-agents
        List<ThreatAgent> threatAgents = this.threatAgentService.findAll();

        //ThreatAgent.ID --> ThreatAgent
        Map<Long, ThreatAgent> allThreatAgentsMap = threatAgents.stream().collect(Collectors.toMap(
            (thratAgent) -> thratAgent.getId(),
            Function.identity()
        ));

        //Keep only the ones interested (>0)
        levelOfInterests.entrySet()
            .stream()
            .filter((entry) -> entry.getValue() <= 0)
            .forEach((entry) -> {
                allThreatAgentsMap.remove(entry.getKey());
            });

        return allThreatAgentsMap.values().stream().collect(Collectors.toSet());
    }

    @Override
    public ThreatAgent getTheStrongestThreatAgent(Long companyProfileID) {
        Set<ThreatAgent> threatAgents = this.getThreatAgents(companyProfileID);

        return this.getTheStrongestThreatAgent(threatAgents);
    }

    private ThreatAgent getTheStrongestThreatAgent(Set<ThreatAgent> threatAgents) {
        ThreatAgent theStrongest = null;

        if (threatAgents != null && !threatAgents.isEmpty()) {
            List<ThreatAgent> ascendingThreatAgentSkills = new ArrayList<>(threatAgents);
            ascendingThreatAgentSkills.sort(new ThreatAgentComparator().reversed());

            theStrongest = ascendingThreatAgentSkills.get(0);
        }

        return theStrongest;
    }

    private void initOrIncrement(Map<Long, Integer> threatAgentPropertyCount, ThreatAgent threatAgent) {
        if (threatAgentPropertyCount.containsKey(threatAgent.getId())) {
            Integer currentCount = threatAgentPropertyCount.get(threatAgent.getId());

            currentCount = currentCount + 1;
            threatAgentPropertyCount.put(threatAgent.getId(), currentCount);
        } else {
            threatAgentPropertyCount.put(threatAgent.getId(), 1);
        }
    }
}
