package eu.hermeneut.web.rest.wp4;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.wp4.MyAssetAttackChance;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.attackstrategy.ThreatAttackFilter;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import eu.hermeneut.utils.threatagent.ThreatAgentComparator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class WP4StepsController {
    private final Logger log = LoggerFactory.getLogger(WP4StepsController.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AnswerService answerService;

    @Autowired
    private MyAnswerService myAnswerService;

    @Autowired
    private AttackStrategyCalculator attackStrategyCalculator;

    @Autowired
    private AnswerCalculator answerCalculator;

    @GetMapping("{selfAssessmentID}/wp4/my-assets/{myAssetID}/attack-chances")
    @Timed
    public List<MyAssetAttackChance> getAttackChances(@PathVariable("selfAssessmentID") Long selfAssessmentID, @PathVariable("myAssetID") Long myAssetID) throws NullInputException, NotFoundException {

        SelfAssessment selfAssessment = null;

        if (selfAssessmentID != null) {
            selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        } else {
            throw new NullInputException("The selfAssessmentID can NOT be NULL!");
        }

        if (selfAssessment == null) {
            throw new NotFoundException("The selfAssessment with ID: " + selfAssessmentID + " was not found!");
        }

        MyAsset myAsset = this.myAssetService.findOneByIDAndSelfAssessment(myAssetID, selfAssessmentID);
        if (myAsset == null) {
            throw new NotFoundException("The MyAsset " + myAssetID + " of the SelfAssessment with ID: " + selfAssessmentID + " was not found!");
        }

        //Make it available after the if scope
        QuestionnaireStatus cisoQStatus = null;
        QuestionnaireStatus externalQStatus = null;

        //Map used to update the likelihood of an AttackStrategy in time O(1).
        Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap = new HashMap<>();

        // get the identified ThreatAgents
        Set<ThreatAgent> threatAgentSet = selfAssessment.getThreatagents();
        log.debug("ThreatAgents: " + Arrays.toString(threatAgentSet.toArray()));

        if (threatAgentSet != null && !threatAgentSet.isEmpty()) {
            List<ThreatAgent> ascendingThreatAgentSkills = new ArrayList<>(threatAgentSet);
            ascendingThreatAgentSkills.sort(new ThreatAgentComparator().reversed());

            ThreatAgent strongestThreatAgent = ascendingThreatAgentSkills.get(0);
            log.debug("Strongest ThreatAgent: " + strongestThreatAgent);

            //Get the containers of MyAsset
            Set<Container> containers = myAsset.getAsset().getContainers();
            Map<Long, Container> containersByIDMap = containers
                .stream()
                .collect(
                    Collectors.toMap(
                        container -> container.getId(),
                        Function.identity()
                    )
                );

            //Get AttackStrategies fro each Container
            List<AttackStrategy> attackStrategies = new ArrayList<>();

            for (Container container : containers) {
                attackStrategies.addAll(this.attackStrategyService.findAllByContainer(container.getId()));
            }

            //Keep only the attackstrategies that can be performed by the Strongest ThreatAgent
            attackStrategies = attackStrategies
                .stream()
                .filter(attackStrategy -> ThreatAttackFilter.isAttackPossible(strongestThreatAgent, attackStrategy))
                .collect(Collectors.toList());

            log.debug("AttackStrategies: " + Arrays.toString(attackStrategies.toArray()));

            Map<Long, AttackStrategy> attackStrategyMap = attackStrategies
                .stream()
                .collect(
                    Collectors.toMap(
                        attackStrategy -> attackStrategy.getId(),
                        Function.identity()
                    )
                );

            //Map used to update the likelihood of an AttackStrategy in time O(1).
            augmentedAttackStrategyMap =
                attackStrategies
                    .stream()
                    .collect(
                        Collectors.toMap(
                            AttackStrategy::getId,
                            attackStrategy -> new AugmentedAttackStrategy(attackStrategy, true)
                        )
                    );

            //Set the Initial Likelihood for the AttackStrategies
            for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {
                AugmentedAttackStrategy attackStrategy = entry.getValue();
                attackStrategy.setInitialLikelihood(this.attackStrategyCalculator.initialLikelihood(attackStrategy).getValue());
            }

            //Get QuestionnaireStatuses by SelfAssessment
            List<QuestionnaireStatus> questionnaireStatuses = this.questionnaireStatusService.findAllBySelfAssessment(selfAssessmentID);

            if (questionnaireStatuses == null || questionnaireStatuses.size() == 0) {
                throw new NotFoundException("NO QuestionaireStatus was found for the SelfAssessment: " + selfAssessmentID);
            }

            cisoQStatus = questionnaireStatuses.stream().filter(questionnaireStatus ->
                questionnaireStatus.getRole().equals(Role.ROLE_CISO) && questionnaireStatus.getQuestionnaire().getPurpose
                    ().equals(QuestionnairePurpose.SELFASSESSMENT))
                .findFirst().orElse(null);
            externalQStatus = questionnaireStatuses.stream().filter(questionnaireStatus ->
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

            if (externalQStatus != null) {
                this.attackStrategyCalculator.calculateRefinedLikelihoods(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);
            } else if (cisoQStatus != null) {
                this.attackStrategyCalculator.calculateContextualLikelihoods(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);
            }
        }


        //Building output
        List<MyAssetAttackChance> myAssetAttackChances = new ArrayList<>();

        for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {

            AugmentedAttackStrategy augmentedAttackStrategy = entry.getValue();
            AttackStrategy attackStrategy = augmentedAttackStrategy;

            MyAssetAttackChance attackChance = new MyAssetAttackChance();
            attackChance.setMyAsset(myAsset);
            attackChance.setAttackStrategy(attackStrategy);

            if (externalQStatus != null) {
                attackChance.setLikelihood(augmentedAttackStrategy.getRefinedLikelihood());
                attackChance.setVulnerability(augmentedAttackStrategy.getRefinedVulnerability());
            } else if (cisoQStatus != null) {
                attackChance.setLikelihood(augmentedAttackStrategy.getContextualLikelihood());
                attackChance.setVulnerability(augmentedAttackStrategy.getContextualVulnerability());
            }

            float critical = attackChance.getLikelihood() * attackChance.getVulnerability();
            attackChance.setCritical(critical);

            myAssetAttackChances.add(attackChance);
        }

        return myAssetAttackChances;
    }
}
