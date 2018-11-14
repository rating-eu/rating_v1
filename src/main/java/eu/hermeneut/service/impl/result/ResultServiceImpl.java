package eu.hermeneut.service.impl.result;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AttackMap;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.result.Result;
import eu.hermeneut.service.*;
import eu.hermeneut.service.result.ResultService;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import eu.hermeneut.utils.likelihood.overall.OverallCalculator;
import eu.hermeneut.utils.threatagent.ThreatAgentComparator;
import eu.hermeneut.web.rest.AssetResource;
import eu.hermeneut.web.rest.result.ResultController;
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
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private AttackStrategyService attackStrategyService;

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

    @Override
    public Result getResult(Long selfAssessmentID) {
        log.debug("REST request to get the RESULT");
        log.debug("SelfAssessmentID: " + selfAssessmentID);

        Result result = new Result();

        //#1 fetch the SelfAssessment
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        log.debug("SelfAssessment: " + selfAssessment);

        if (selfAssessment != null) {
            //#2 get the identified ThreatAgents
            Set<ThreatAgent> threatAgentSet = selfAssessment.getThreatagents();
            log.debug("ThreatAgents: " + Arrays.toString(threatAgentSet.toArray()));

            if (threatAgentSet != null && !threatAgentSet.isEmpty()) {
                List<ThreatAgent> ascendingThreatAgentSkills = new ArrayList<>(threatAgentSet);
                ascendingThreatAgentSkills.sort(new ThreatAgentComparator().reversed());

                for (ThreatAgent threatAgent : ascendingThreatAgentSkills) {
                    log.debug("Skills: " + threatAgent.getSkillLevel().getValue());
                }

                ThreatAgent strongestThreatAgent = ascendingThreatAgentSkills.get(0);
                log.debug("Strongest ThreatAgent: " + strongestThreatAgent);

                List<AttackStrategy> attackStrategies = this.attackStrategyService.findAll();
                log.debug("AttackStrategies: " + Arrays.toString(attackStrategies.toArray()));

                Map<Long, AttackStrategy> attackStrategyMap = attackStrategies.stream().collect(Collectors.toMap(AttackStrategy::getId, attackStrategy -> attackStrategy));

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
                //result.setInitialVulnerability(this.overallCalculator.overallInitialLikelihoodByThreatAgent(strongestThreatAgent, attackMap));
                result.setInitialVulnerability(new HashMap<Long, Float>() {
                    {
                        for (ThreatAgent threatAgent : ascendingThreatAgentSkills) {
                            log.debug("Skills: " + threatAgent.getSkillLevel().getValue());

                            put(threatAgent.getId(), ResultServiceImpl.this.overallCalculator.overallInitialLikelihoodByThreatAgent(threatAgent, attackMap));
                        }
                    }
                });

                //#4 get the questionnaireStatuses by CISO and EXTERNAL_AUDIT
                List<QuestionnaireStatus> questionnaireStatuses = this.questionnaireStatusService.findAllBySelfAssessment(selfAssessment.getId());

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

                    this.attackStrategyCalculator.calculateContextualLikelihoods(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);

                    //#Output 2 ==> OVERALL CONTEXTUAL LIKELIHOOD
                    result.setContextualVulnerability(new HashMap<Long, Float>() {
                        {
                            for (ThreatAgent threatAgent : ascendingThreatAgentSkills) {
                                put(threatAgent.getId(), ResultServiceImpl.this.overallCalculator.overallContextualLikelihoodByThreatAgent(threatAgent, attackMap));
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

                    this.attackStrategyCalculator.calculateRefinedLikelihoods(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);

                    //#Output 3 ==> OVERALL REFINED LIKELIHOOD
                    result.setRefinedVulnerability(new HashMap<Long, Float>() {
                        {
                            for (ThreatAgent threatAgent : ascendingThreatAgentSkills) {
                                put(threatAgent.getId(), ResultServiceImpl.this.overallCalculator.overallRefinedLikelihoodByThreatAgent(threatAgent, attackMap));
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
}
