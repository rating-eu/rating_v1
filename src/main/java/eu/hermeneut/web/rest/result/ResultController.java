package eu.hermeneut.web.rest.result;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.*;
import eu.hermeneut.domain.result.AttackMap;
import eu.hermeneut.domain.result.AugmentedAttackStrategy;
import eu.hermeneut.domain.result.Result;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import eu.hermeneut.utils.likelihood.overall.OverallCalculator;
import eu.hermeneut.utils.threatagent.ThreatAgentComparator;
import eu.hermeneut.web.rest.AssetResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * REST controller for managing the result.
 */
@RestController
@RequestMapping("/api")
public class ResultController {
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

    @GetMapping("/likelihood/max")
    public int getMaxLikelihood() {
        final int numerator = AttackStrategyLikelihood.HIGH.getValue() * 5/*1+1+1+1+1*/ + AttackStrategyLikelihood.HIGH.getValue() * 5/*5*/;
        return numerator / OverallCalculator.DENOMINATOR;
    }

    @GetMapping("/result/{selfAssessmentID}")
    public Result getResult(@PathVariable Long selfAssessmentID) {
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

                        put(threatAgent.getId(), ResultController.this.overallCalculator.overallInitialLikelihoodByThreatAgent(threatAgent, attackMap));
                    }
                }
            });

            //#3 get the answer weights
            List<AnswerWeight> answerWeights = this.answerWeightService.findAll();
            Map<QuestionType, Map<AnswerLikelihood, AnswerWeight>> answerWeightsMap = new HashMap<>();

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

                //Group the MyAnswers by AttackStrategy and find the likelihood for each of them.
                Map<AugmentedAttackStrategy, Set<MyAnswer>> attackAnswersMap = new HashMap<>();

                for (MyAnswer myAnswer : myAnswers) {
                    myAnswer.setQuestion(questionsMap.get(myAnswer.getQuestion().getId()));
                    myAnswer.setAnswer(answersMap.get(myAnswer.getAnswer().getId()));

                    Question question = myAnswer.getQuestion();
                    Set<AttackStrategy> attacks = question.getAttackStrategies();

                    for (AttackStrategy attackStrategy : attacks) {
                        AugmentedAttackStrategy augmentedAttackStrategy = augmentedAttackStrategyMap.get(attackStrategy.getId());

                        if (attackAnswersMap.containsKey(augmentedAttackStrategy)) {
                            Set<MyAnswer> myAnswerSet = attackAnswersMap.get(augmentedAttackStrategy);
                            myAnswerSet.add(myAnswer);
                        } else {
                            Set<MyAnswer> myAnswerSet = new HashSet<>();
                            myAnswerSet.add(myAnswer);
                            attackAnswersMap.put(augmentedAttackStrategy, myAnswerSet);
                        }
                    }
                }

                for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {
                    AugmentedAttackStrategy augmentedAttackStrategy = entry.getValue();
                    log.debug("AugmentedAttackStrategy: " + augmentedAttackStrategy);

                    Set<MyAnswer> myAnswerSet = attackAnswersMap.get(augmentedAttackStrategy);
                    log.debug("MyAnswerSet: " + myAnswerSet);

                    augmentedAttackStrategy.setCisoAnswersLikelihood(this.answerCalculator.getAnswersLikelihood(myAnswerSet));
                    augmentedAttackStrategy.setContextualLikelihood((augmentedAttackStrategy.getInitialLikelihood() + augmentedAttackStrategy.getCisoAnswersLikelihood()) / 2);
                }

                //#Output 2 ==> OVERALL CONTEXTUAL LIKELIHOOD
                result.setContextualVulnerability(new HashMap<Long, Float>() {
                    {
                        for (ThreatAgent threatAgent : ascendingThreatAgentSkills) {
                            put(threatAgent.getId(), ResultController.this.overallCalculator.overallContextualLikelihoodByThreatAgent(threatAgent, attackMap));
                        }
                    }
                });
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

                for (MyAnswer myAnswer : myAnswers) {
                    myAnswer.setQuestion(questionsMap.get(myAnswer.getQuestion().getId()));
                    myAnswer.setAnswer(answersMap.get(myAnswer.getAnswer().getId()));

                    Question question = myAnswer.getQuestion();
                    Set<AttackStrategy> attacks = question.getAttackStrategies();

                    for (AttackStrategy attackStrategy : attacks) {
                        AugmentedAttackStrategy augmentedAttackStrategy = augmentedAttackStrategyMap.get(attackStrategy.getId());

                        if (attackAnswersMap.containsKey(augmentedAttackStrategy)) {
                            Set<MyAnswer> myAnswerSet = attackAnswersMap.get(augmentedAttackStrategy);
                            myAnswerSet.add(myAnswer);
                        } else {
                            Set<MyAnswer> myAnswerSet = new HashSet<>();
                            myAnswerSet.add(myAnswer);
                            attackAnswersMap.put(augmentedAttackStrategy, myAnswerSet);
                        }
                    }
                }

                for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {
                    AugmentedAttackStrategy augmentedAttackStrategy = entry.getValue();
                    log.debug("AugmentedAttackStrategy: " + augmentedAttackStrategy);

                    Set<MyAnswer> myAnswerSet = attackAnswersMap.get(augmentedAttackStrategy);
                    log.debug("MyAnswerSet: " + myAnswerSet);

                    augmentedAttackStrategy.setExternalAuditAnswersLikelihood(this.answerCalculator.getAnswersLikelihood(myAnswerSet));
                    augmentedAttackStrategy.setRefinedLikelihood((augmentedAttackStrategy.getInitialLikelihood() + augmentedAttackStrategy.getExternalAuditAnswersLikelihood()) / 2);
                }

                //#Output 3 ==> OVERALL REFINED LIKELIHOOD
                result.setRefinedVulnerability(new HashMap<Long, Float>() {
                    {
                        for (ThreatAgent threatAgent : ascendingThreatAgentSkills) {
                            put(threatAgent.getId(), ResultController.this.overallCalculator.overallRefinedLikelihoodByThreatAgent(threatAgent, attackMap));
                        }
                    }
                });
            }
        } else {

        }

        return result;
    }
}
