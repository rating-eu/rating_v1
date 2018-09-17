package eu.hermeneut.web.rest.attackmap;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AttackCKC7Matrix;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import eu.hermeneut.utils.likelihood.overall.OverallCalculator;
import eu.hermeneut.web.rest.AssetResource;
import eu.hermeneut.web.rest.result.ResultController;
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
 * REST controller for managing the AttackMap.
 */
@RestController
@RequestMapping("/api")
public class AttackMapController {

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

    @GetMapping("/{selfAssessmentID}/attack-matrix")
    public AttackCKC7Matrix getAttackMatrix(@PathVariable Long selfAssessmentID) throws NotFoundException {
        //#1 fetch the SelfAssessment
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with ID: " + selfAssessmentID + "NOT FOUND!");
        }

        List<AttackStrategy> attackStrategies = this.attackStrategyService.findAll();

        if (attackStrategies == null || attackStrategies.size() == 0) {
            throw new NotFoundException("AttackStrategies NOT FOUND!");
        }

        //Map used to update the likelihood of an AttackStrategy in time O(1).
        Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap = attackStrategies.stream().collect(Collectors.toMap(AttackStrategy::getId, attackStrategy -> new AugmentedAttackStrategy(attackStrategy, true)));

        List<QuestionnaireStatus> questionnaireStatuses = this.questionnaireStatusService.findAllBySelfAssessment(selfAssessment.getId());
        //#1 Set the Initial Likelihood for the AttackStrategies
        for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {
            AugmentedAttackStrategy attackStrategy = entry.getValue();
            attackStrategy.setInitialLikelihood(this.attackStrategyCalculator.initialLikelihood(attackStrategy).getValue());
        }

        if (questionnaireStatuses != null && questionnaireStatuses.size() != 0) {
            QuestionnaireStatus cisoQuestionnaireStatus = questionnaireStatuses.stream().filter(questionnaireStatus -> {
                return questionnaireStatus.getQuestionnaire().getPurpose().equals(QuestionnairePurpose.SELFASSESSMENT) && questionnaireStatus.getRole() == Role.ROLE_CISO;
            }).findFirst().orElse(null);
            QuestionnaireStatus externalAuditQuestionnaireStatus = questionnaireStatuses.stream().filter(questionnaireStatus -> {
                return questionnaireStatus.getQuestionnaire().getPurpose().equals(QuestionnairePurpose.SELFASSESSMENT) && questionnaireStatus.getRole() == Role.ROLE_EXTERNAL_AUDIT;
            }).findFirst().orElse(null);

            //#2 Set the Contextual Likelihood
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

                    if (myAnswerSet != null) {
                        augmentedAttackStrategy.setContextualVulnerability(this.answerCalculator.getAnswersLikelihood(myAnswerSet));
                        augmentedAttackStrategy.setContextualLikelihood((augmentedAttackStrategy.getInitialLikelihood() + augmentedAttackStrategy.getContextualVulnerability()) / 2);
                    } else {
                        //TODO Same as InitialLikelihood ???
                    }
                }
            }

            //#3 Set the Refined Likelihood
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
                    Question question = myAnswer.getQuestion();
                    log.debug("Question: " + question);
                    Question fullQuestion = questionsMap.get(question.getId());
                    log.debug("Full question: " + fullQuestion);

                    Answer answer = myAnswer.getAnswer();
                    log.debug("Answer: " + answer);
                    Answer fullAnswer = answersMap.get(myAnswer.getAnswer().getId());
                    log.debug("FullAnswer: " + fullAnswer);

                    myAnswer.setQuestion(fullQuestion);
                    myAnswer.setAnswer(fullAnswer);

                    Set<AttackStrategy> attacks = fullQuestion.getAttackStrategies();
                    log.debug("Attacks: " + attacks);

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

                    if (myAnswerSet != null) {
                        augmentedAttackStrategy.setRefinedVulnerability(this.answerCalculator.getAnswersLikelihood(myAnswerSet));
                        augmentedAttackStrategy.setRefinedLikelihood((augmentedAttackStrategy.getInitialLikelihood() + augmentedAttackStrategy.getRefinedVulnerability()) / 2);
                    } else {
                        //TODO same as ContextualLikelihood ???
                    }
                }
            }
        }

        AttackCKC7Matrix attackMatrix = new AttackCKC7Matrix(augmentedAttackStrategyMap);

        return attackMatrix;
    }
}
