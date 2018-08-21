package eu.hermeneut.web.rest.wp4;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.result.AugmentedAttackStrategy;
import eu.hermeneut.domain.wp4.MyAssetAttackChance;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import eu.hermeneut.utils.threatagent.ThreatAgentComparator;
import eu.hermeneut.utils.wp4.ListSplitter;
import eu.hermeneut.utils.wp4.MyAssetComparator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("{selfAssessmentID}/wp4/my-assets/{myAssetID}/attack-chances")
    @Timed
    public List<MyAssetAttackChance> get(@PathVariable("selfAssessmentID") Long selfAssessmentID, @PathVariable("myAssetID") Long myAssetID) throws NullInputException, NotFoundException {

        SelfAssessment selfAssessment = null;

        if (selfAssessmentID != null) {
            selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        } else {
            throw new NullInputException("The selfAssessmentID can NOT be NULL!");
        }

        if (selfAssessment == null) {
            throw new NotFoundException("The selfAssessment with ID: " + selfAssessmentID + " was not found!");
        }

        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

        if (myAssets == null || myAssets.size() == 0) {
            throw new NotFoundException("The MyAssets of the SelfAssessment with ID: " + selfAssessmentID + " were not found!");
        }

        Map<Long, MyAsset> myAssetsMap = myAssets
            .stream()
            .collect(Collectors.toMap(
                myAsset -> myAsset.getId(),//KeyMapper
                Function.identity()//ValueMapper (RealID)
            ));

        MyAsset myAsset = null;

        if (!myAssetsMap.containsKey(myAssetID)) {
            throw new NotFoundException("MyAsset with id: " + myAssetID + " was not found for the SelfAssessment " + selfAssessmentID);
        } else {
            myAsset = myAssetsMap.get(myAssetID);
        }

        //===Clustering MyAssets 5 by 5===
        //Sort them by EconomicValue
        myAssets.sort(new MyAssetComparator());

        Map<Integer, List<MyAsset>> myAssetsByCluster = ListSplitter.split(myAssets, 5);

        Map<Long/*MyAsset.ID*/, Integer/*ClusterID*/> clusterByMyAssetID = new HashMap<>();

        for (Map.Entry<Integer, List<MyAsset>> entry : myAssetsByCluster.entrySet()) {
            int cluster = entry.getKey();
            List<MyAsset> assets = entry.getValue();

            for (MyAsset asset : assets) {
                clusterByMyAssetID.put(asset.getId(), cluster);
            }
        }

        final int CLUSTERS = 5;
        final int CLUSTER_SIZE = myAssets.size() / CLUSTERS;

        for (int cluster = 1, startIndex = 0; cluster <= CLUSTERS; cluster++) {
            int endIndexPlusOne = startIndex + cluster * CLUSTER_SIZE;
            if (endIndexPlusOne > myAssets.size()) {
                endIndexPlusOne = myAssets.size();
            }

            myAssetsByCluster.put(cluster, myAssets.subList(startIndex, endIndexPlusOne));
        }

        // get the identified ThreatAgents
        Set<ThreatAgent> threatAgentSet = selfAssessment.getThreatagents();
        log.debug("ThreatAgents: " + Arrays.toString(threatAgentSet.toArray()));

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
        Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap =
            attackStrategies
                .stream()
                .collect(
                    Collectors.toMap(
                        AttackStrategy::getId,
                        attackStrategy -> new AugmentedAttackStrategy(attackStrategy)
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

        QuestionnaireStatus externalQStatus = questionnaireStatuses.stream().filter(questionnaireStatus -> questionnaireStatus.getRole().equals(Role.ROLE_EXTERNAL_AUDIT)).findFirst().orElse(null);

        if (externalQStatus == null) {
            throw new NotFoundException("QuestionnaireStatus for Role ExternalAudit was NOT FOUND!");
        }

        Questionnaire questionnaire = externalQStatus.getQuestionnaire();
        List<Question> questions = this.questionService.findAllByQuestionnaire(questionnaire);
        List<Answer> answers = this.answerService.findAll();
        Map<Long/*AnswerID*/, Answer> answersMap = answers.stream().collect(Collectors.toMap(Answer::getId, Function.identity()));
        Map<Long/*QuestionID*/, Question> questionsMap = questions.stream().collect(Collectors.toMap(Question::getId, Function.identity()));

        List<MyAnswer> myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(externalQStatus.getId());

        if (myAnswers == null || myAnswers.size() == 0) {
            throw new NotFoundException("MyAnswers not found for QuestionnaireStatus with id: " + externalQStatus.getId());
        }

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
                augmentedAttackStrategy.setExternalAuditAnswersLikelihood(this.answerCalculator.getAnswersLikelihood(myAnswerSet));
                augmentedAttackStrategy.setRefinedLikelihood((augmentedAttackStrategy.getInitialLikelihood() + augmentedAttackStrategy.getExternalAuditAnswersLikelihood()) / 2);
            } else {
                //TODO same as ContextualLikelihood ???
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

            attackChance.setLikelihood(augmentedAttackStrategy.getRefinedLikelihood());
            attackChance.setVulnerability(augmentedAttackStrategy.getExternalAuditAnswersLikelihood());

            float critical = attackChance.getLikelihood() * attackChance.getVulnerability();
            attackChance.setCritical(critical);

            if (clusterByMyAssetID.containsKey(myAssetID)) {
                int cluster = clusterByMyAssetID.get(myAssetID);
                attackChance.setImpact((float) cluster);
            } else {

            }
        }

        return myAssetAttackChances;
    }
}
