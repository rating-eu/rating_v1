package eu.hermeneut.service.impl.attackmap;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.utils.attackstrategy.ThreatAttackFilter;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
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
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private MyAnswerService myAnswerService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AnswerService answerService;

    @Autowired
    private AttackStrategyCalculator attackStrategyCalculator;

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

        augmentedAttackStrategyMap.values().forEach(augmentedAttackStrategy -> {
            //===INITIAL LIKELIHOOD===
            augmentedAttackStrategy.setInitialLikelihood(this.attackStrategyCalculator.initialLikelihood(augmentedAttackStrategy).getValue());
            //===INITIAL VULNERABILITY===
            augmentedAttackStrategy.setInitialVulnerability(this.attackStrategyCalculator.initialLikelihood(augmentedAttackStrategy).getValue());
            //===INITIAL CRITICALITY===
            augmentedAttackStrategy.setInitialCriticality(augmentedAttackStrategy.getInitialLikelihood() * augmentedAttackStrategy.getInitialVulnerability());
        });


        //Get QuestionnaireStatuses by SelfAssessment
        List<QuestionnaireStatus> questionnaireStatuses = this.questionnaireStatusService.findAllBySelfAssessment(selfAssessmentID);

        if (questionnaireStatuses != null && questionnaireStatuses.size() > 0) {
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

            if (cisoQStatus != null) {
                //Use cisoQStatus
                questionnaire = cisoQStatus.getQuestionnaire();
                myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(cisoQStatus.getId());

                if (myAnswers == null || myAnswers.size() == 0) {
                    throw new NotFoundException("MyAnswers not found for QuestionnaireStatus with id: " + cisoQStatus.getId());
                }

                questions = this.questionService.findAllByQuestionnaire(questionnaire);
                answers = this.answerService.findAll();
                answersMap = answers.stream().collect(Collectors.toMap(Answer::getId, Function.identity()));
                questionsMap = questions.stream().collect(Collectors.toMap(Question::getId, Function.identity()));

                //===CONTEXTUAL VULNERABILITY, LIKELIHOOD, CRITICALITY
                this.attackStrategyCalculator.calculateContextualVulnerabilityLikelihoodAndCriticalities(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);
            }

            if (cisoQStatus != null && externalQStatus != null) {
                questionnaire = externalQStatus.getQuestionnaire();
                myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(externalQStatus.getId());

                if (myAnswers == null || myAnswers.size() == 0) {
                    throw new NotFoundException("MyAnswers not found for QuestionnaireStatus with id: " + externalQStatus.getId());
                }

                questions = this.questionService.findAllByQuestionnaire(questionnaire);
                answers = this.answerService.findAll();
                answersMap = answers.stream().collect(Collectors.toMap(Answer::getId, Function.identity()));
                questionsMap = questions.stream().collect(Collectors.toMap(Question::getId, Function.identity()));

                //===REFINED VULNERABILITY, LIKELIHOOD, CRITICALITY
                this.attackStrategyCalculator.calculateRefinedVulnerabilityLikelihoodAndCriticalities(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);
            }
        }

        return augmentedAttackStrategyMap;
    }
}
