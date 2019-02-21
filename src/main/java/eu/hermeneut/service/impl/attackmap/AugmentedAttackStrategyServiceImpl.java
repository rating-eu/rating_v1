package eu.hermeneut.service.impl.attackmap;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.service.result.ResultService;
import eu.hermeneut.utils.attackstrategy.ThreatAttackFilter;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import eu.hermeneut.utils.likelihood.overall.OverallCalculator;
import eu.hermeneut.utils.threatagent.ThreatAgentComparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class AugmentedAttackStrategyServiceImpl implements AugmentedAttackStrategyService {

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private LevelService levelService;

    @Autowired
    private PhaseService phaseService;

    @Autowired
    private AnswerWeightService answerWeightService;

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

    @Autowired
    private AnswerCalculator answerCalculator;

    @Autowired
    private ResultService resultService;

    @Override
    public Map<Long, AugmentedAttackStrategy> getAugmentedAttackStrategyMap(Long selfAssessmentID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("The selfAssessment Not Found!!!");
        }

        // Get the identified ThreatAgents
        Set<ThreatAgent> threatAgentSet = selfAssessment.getThreatagents();

        if (threatAgentSet == null || threatAgentSet.isEmpty()) {
            throw new NotFoundException("No Threat Agent found for this SelfAssessment!!!");
        }

        // Get all the AttackStrategies
        List<AttackStrategy> attackStrategies = this.attackStrategyService.findAll();

        if (attackStrategies == null || attackStrategies.size() == 0) {
            throw new NotFoundException("AttackStrategies NOT FOUND!");
        }

        List<ThreatAgent> ascendingThreatAgentSkills = new ArrayList<>(threatAgentSet);
        ascendingThreatAgentSkills.sort(new ThreatAgentComparator().reversed());

        // Identify the Strongest ThreatAgent
        ThreatAgent strongestThreatAgent = ascendingThreatAgentSkills.get(0);

        //Map used to update the likelihood of an AttackStrategy in time O(1).
        Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap = attackStrategies.stream()
            // Keep only the AttackStrategies that can be performed
            .filter(attackStrategy -> ThreatAttackFilter.isAttackPossible(strongestThreatAgent, attackStrategy))
            .collect(Collectors.toMap(AttackStrategy::getId, attackStrategy -> new AugmentedAttackStrategy(attackStrategy, true)));

        //===INITIAL LIKELIHOOD===
        augmentedAttackStrategyMap.values().forEach(augmentedAttackStrategy -> {
            augmentedAttackStrategy.setInitialLikelihood(this.attackStrategyCalculator.initialLikelihood(augmentedAttackStrategy).getValue());
        });

        //Get QuestionnaireStatuses by SelfAssessment
        List<QuestionnaireStatus> questionnaireStatuses = this.questionnaireStatusService.findAllBySelfAssessment(selfAssessmentID);

        if (questionnaireStatuses == null || questionnaireStatuses.size() == 0) {
            throw new NotFoundException("NO QuestionaireStatus was found for the SelfAssessment: " + selfAssessmentID);
        }

        QuestionnaireStatus cisoQStatus = questionnaireStatuses.stream().filter(questionnaireStatus ->
            questionnaireStatus.getRole().equals(Role.ROLE_CISO) && questionnaireStatus.getQuestionnaire().getPurpose
                ().equals(QuestionnairePurpose.SELFASSESSMENT))
            .findFirst().orElse(null);
        
        QuestionnaireStatus externalQStatus = questionnaireStatuses.stream().filter(questionnaireStatus ->
            questionnaireStatus.getRole().equals(Role.ROLE_EXTERNAL_AUDIT) && questionnaireStatus.getQuestionnaire().getPurpose
                ().equals(QuestionnairePurpose.SELFASSESSMENT)).findFirst().orElse(null);

        Questionnaire questionnaire;// = externalQStatus.getQuestionnaire();
        List<Question> questions;// = this.questionService.findAllByQuestionnaire(questionnaire);
        List<Answer> answers;// = this.answerService.findAll();
        Map<Long/*AnswerID*/, Answer> answersMap;// = answers.stream().collect(Collectors.toMap(Answer::getId, Function.identity()));
        Map<Long/*QuestionID*/, Question> questionsMap;// = questions.stream().collect(Collectors.toMap(Question::getId, Function.identity()));
        List<MyAnswer> myAnswers;// = this.myAnswerService.findAllByQuestionnaireStatus(externalQStatus.getId());

        if (externalQStatus != null) {
            //Use cisoQStatus
            questionnaire = externalQStatus.getQuestionnaire();
            myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(externalQStatus.getId());

            if (myAnswers == null || myAnswers.size() == 0) {
                throw new NotFoundException("MyAnswers not found for QuestionnaireStatus with id: " + externalQStatus.getId());
            }
        } else if (cisoQStatus != null) {
            //Use externalQStatus
            questionnaire = cisoQStatus.getQuestionnaire();
            myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(cisoQStatus.getId());

            if (myAnswers == null || myAnswers.size() == 0) {
                throw new NotFoundException("MyAnswers not found for QuestionnaireStatus with id: " + cisoQStatus.getId());
            }
        } else {
            throw new NotFoundException("QuestionnaireStatuses for Role ExternalAudit and CISO NOT FOUND!");
        }

        questions = this.questionService.findAllByQuestionnaire(questionnaire);
        answers = this.answerService.findAll();
        answersMap = answers.stream().collect(Collectors.toMap(Answer::getId, Function.identity()));
        questionsMap = questions.stream().collect(Collectors.toMap(Question::getId, Function.identity()));

        if (cisoQStatus != null) {
            this.attackStrategyCalculator.calculateContextualLikelihoods(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);
        }

        if (externalQStatus != null) {
            this.attackStrategyCalculator.calculateRefinedLikelihoods(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);
        }

        return augmentedAttackStrategyMap;
    }

    @Override
    public Map<Long, AugmentedAttackStrategy> weightAugmentedAttackStrategyMap(Long selfAssessmentID, Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment NOT Found!!!");
        }

        Set<ThreatAgent> threatAgents = selfAssessment.getThreatagents();

        if (threatAgents == null || threatAgents.isEmpty()) {
            throw new NotFoundException("ThreatAgents NOT Found!!!");
        }

        Map<Long, Float> levelsOfInterestMap = this.resultService.getLevelsOfInterest(selfAssessmentID);

        if (levelsOfInterestMap == null || levelsOfInterestMap.isEmpty()) {
            throw new NotFoundException("LevelsOfInterest NOT FOund!!!");
        }

        Iterator<AugmentedAttackStrategy> attackStrategyIterator = augmentedAttackStrategyMap.values().iterator();

        Map<Long, AugmentedAttackStrategy> weightedAugmentedAttackStrategyMap = new HashMap<>();

        while (attackStrategyIterator.hasNext()) {
            try {
                AugmentedAttackStrategy augmentedAttackStrategy = (AugmentedAttackStrategy) attackStrategyIterator.next().clone();

                //Filter the ThreatAgents that can perform this attack
                List<ThreatAgent> threatAgentsSubset = threatAgents.stream().filter(threatAgent -> ThreatAttackFilter.isAttackPossible(threatAgent, augmentedAttackStrategy)).collect(Collectors.toList());

                //For each ThreatAgent weight the AttackStrategy
                if (threatAgentsSubset != null && !threatAgentsSubset.isEmpty()) {
                    Iterator<ThreatAgent> threatAgentIterator = threatAgentsSubset.iterator();

                    //SUM Vulnerability * LevelOfInterest of each ThreatAgent
                    float initialVulnerabilityNumerator = 0F;
                    float contextualVulnerabilityNumerator = 0F;
                    float refinedVulnerabilityNumerator = 0F;

                    //SUM Vulnerability * LevelOfInterest of each ThreatAgent
                    float initialLikelihoodNumerator = 0F;
                    float contextualLikelihoodNumerator = 0F;
                    float refinedLikelihoodNumerator = 0F;

                    //Number of ThreatAgents
                    int denominator = threatAgentsSubset.size();

                    float averageInitialVulnerability = 0F;
                    float averageInitialLikelihood = 0F;

                    float averageContextualVulnerability = 0F;
                    float averageContextualLikelihood = 0F;

                    float averageRefinedVulnerability = 0F;
                    float averageRefinedLikelihood = 0F;

                    while (threatAgentIterator.hasNext()) {
                        ThreatAgent threatAgent = threatAgentIterator.next();

                        Float levelOfInterest = levelsOfInterestMap.getOrDefault(threatAgent.getId(), 0F);

                        Float initialVulnerability = 0F;
                        Float contextualVulnerability = 0F;
                        Float refinedVulnerability = 0F;

                        Float initialLikelihood = 0F;
                        Float contextualLikelihood = 0F;
                        Float refinedLikelihood = 0F;

                        if (augmentedAttackStrategy.getInitialLikelihood() > 0) {
                            initialVulnerability = augmentedAttackStrategy.getInitialLikelihood();
                            initialLikelihood = augmentedAttackStrategy.getInitialLikelihood();

                            initialVulnerabilityNumerator += initialVulnerability * levelOfInterest;
                            initialLikelihoodNumerator += initialLikelihood * levelOfInterest;
                        }

                        if (augmentedAttackStrategy.getContextualVulnerability() > 0 && augmentedAttackStrategy.getContextualLikelihood() > 0) {
                            contextualVulnerability = augmentedAttackStrategy.getContextualVulnerability();
                            contextualLikelihood = augmentedAttackStrategy.getContextualLikelihood();

                            contextualVulnerabilityNumerator += contextualVulnerability * levelOfInterest;
                            contextualLikelihoodNumerator += contextualLikelihood * levelOfInterest;
                        }

                        if (augmentedAttackStrategy.getRefinedVulnerability() > 0 && augmentedAttackStrategy.getRefinedLikelihood() > 0) {
                            refinedVulnerability = augmentedAttackStrategy.getRefinedVulnerability();
                            refinedLikelihood = augmentedAttackStrategy.getRefinedLikelihood();

                            refinedVulnerabilityNumerator += refinedVulnerability * levelOfInterest;
                            refinedLikelihoodNumerator += refinedLikelihood * levelOfInterest;
                        }
                    }

                    averageInitialVulnerability = initialVulnerabilityNumerator / denominator;
                    averageInitialLikelihood = initialLikelihoodNumerator / denominator;

                    averageContextualVulnerability = contextualVulnerabilityNumerator / denominator;
                    averageContextualLikelihood = contextualLikelihoodNumerator / denominator;

                    averageRefinedVulnerability = refinedVulnerabilityNumerator / denominator;
                    averageRefinedLikelihood = refinedLikelihoodNumerator / denominator;

                    //Update the likelihood and vulnerabilities of the attack strategy with the averaged values
                    //among all the threat agents.
                    augmentedAttackStrategy.setInitialLikelihood(averageInitialLikelihood);

                    augmentedAttackStrategy.setContextualVulnerability(averageContextualVulnerability);
                    augmentedAttackStrategy.setContextualLikelihood(averageContextualLikelihood);

                    augmentedAttackStrategy.setRefinedVulnerability(averageRefinedVulnerability);
                    augmentedAttackStrategy.setRefinedLikelihood(averageRefinedLikelihood);

                    weightedAugmentedAttackStrategyMap.put(augmentedAttackStrategy.getId(), augmentedAttackStrategy);
                }
            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
            }
        }

        return weightedAugmentedAttackStrategyMap;
    }
}
