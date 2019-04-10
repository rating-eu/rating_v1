package eu.hermeneut.web.rest.output;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.AssetType;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.output.IntangibleAssetsAttacksLikelihoodTable;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.attackstrategy.ThreatAttackFilter;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import eu.hermeneut.utils.threatagent.ThreatAgentComparator;
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
import java.util.stream.Stream;

@RestController
@RequestMapping("/api")
public class WP3OutputController {

    Logger logger = LoggerFactory.getLogger(WP3OutputController.class);

    @Autowired
    private AssetCategoryService assetCategoryService;

    @Autowired
    private AssetService assetService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private AttackStrategyCalculator attackStrategyCalculator;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private MyAnswerService myAnswerService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AnswerService answerService;

    @Autowired
    private AnswerCalculator answerCalculator;

    @GetMapping("{selfAssessmentID}/output/intangibles/impact")
    public IntangibleAssetsAttacksLikelihoodTable intangiblesImpact(@PathVariable Long selfAssessmentID) {

        //Get the SelfAssessment by the given ID
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        logger.info("SelfAssessment: " + selfAssessment);

        if (selfAssessment != null) {
            //Get the StrongestThreatAgent
            Set<ThreatAgent> threatAgentSet = selfAssessment.getThreatagents();
            List<ThreatAgent> ascendingThreatAgentSkills = new ArrayList<>(threatAgentSet);
            ascendingThreatAgentSkills.sort(new ThreatAgentComparator().reversed());
            ThreatAgent strongestThreatAgent = ascendingThreatAgentSkills.get(0);

            //Get all the Intangible AssetCategories
            List<AssetCategory> intangibleAssetCategories = this.assetCategoryService.findAllByAssetType(AssetType.INTANGIBLE);//OK
            //Map the AssetCategories by ID
            Map<Long/*AssetCategory.ID*/, AssetCategory> assetCategoryMap = intangibleAssetCategories.stream().collect(Collectors.toMap(AssetCategory::getId, Function.identity()));//OK

            /*
             *For each of the above AssetCategories,
             *get all the Intangible Assets belonging to that category,
             *and for each of them, get their container.
             */
            List<Asset> allAssets = this.assetService.findAll();//OK

            //Filter out only the INTANGIBLE assets
            List<Asset> intangibleAssets = allAssets.stream().filter(asset -> asset.getAssetcategory().getType().equals(AssetType.INTANGIBLE)).collect(Collectors.toList());//OK
            //Map the Assets by AssetCategory.ID
            Map<Long/*AssetCategory.ID*/, List<Asset>> intangibleAssetsByCategoryMap = intangibleAssets.stream().collect(Collectors.groupingBy(asset -> asset.getAssetcategory().getId()));//OK

            //Get the container for each of the above asset
            Iterator<Asset> intangiblesIterator = intangibleAssets.iterator();
            //Map the Containers by AssetCategory.ID
            Map<Long/*AssetCategory.ID*/, Set<Container>> containersByCategoryMap =//OK
                intangibleAssets
                    .stream()
                    .collect(
                        Collectors.toMap(
                            asset -> asset.getAssetcategory().getId(),//KeyMapper by AssetCategory.ID
                            Asset::getContainers,//ValueMapper by Asset.containers
                            (oldContainerSet, newContainerSet) -> Stream.concat(oldContainerSet.stream(), newContainerSet.stream()).collect(Collectors.toSet())//MergeFunction
                        )
                    );

            logger.info("ContainersByCategoryMap: " + containersByCategoryMap.size());

            //TODO
            //Get the AttackStrategy for each container
            List<AttackStrategy> attackStrategies = this.attackStrategyService.findAll();
            //Keep only the attackstrategies that can be performed by the StrongestThreatAgent
            attackStrategies = attackStrategies
                .stream()
                .filter(attackStrategy -> ThreatAttackFilter.isAttackPossible(strongestThreatAgent, attackStrategy))
                .collect(Collectors.toList());

            Map<Long, AttackStrategy> attackStrategyMap = attackStrategies.stream().collect(Collectors.toMap(AttackStrategy::getId, attackStrategy -> attackStrategy));

            //Map the AttackStrategies by Container.ID
            Map<Long/*Container.ID*/, Set<AttackStrategy>> attackStrategiesByContainerMap = new HashMap<>();

            Iterator<AttackStrategy> attackStrategyIterator = attackStrategies.iterator();

            while (attackStrategyIterator.hasNext()) {
                AttackStrategy attackStrategy = attackStrategyIterator.next();
                Set<Level> levels = attackStrategy.getLevels();
                Iterator<Level> levelIterator = levels.iterator();

                while (levelIterator.hasNext()) {
                    Level level = levelIterator.next();
                    Container container = level.getContainer();

                    if (attackStrategiesByContainerMap.containsKey(container.getId())) {
                        Set<AttackStrategy> attackStrategiesByContainer = attackStrategiesByContainerMap.get(container.getId());
                        attackStrategiesByContainer.add(attackStrategy);
                    } else {
                        Set<AttackStrategy> attackStrategiesByContainer = new HashSet<>();
                        attackStrategiesByContainer.add(attackStrategy);

                        attackStrategiesByContainerMap.put(container.getId(), attackStrategiesByContainer);
                    }
                }
            }

            //Map the AttackStrategies by AssetCategory
            Map<Long/*AssetCategory.ID*/, Set<AttackStrategy>> attackStrategiesByAssetCategoryMap = new HashMap<>();

            //containersByCategoryMap
            //attackStrategiesByContainerMap

            for (Map.Entry<Long/*AssetCategory.ID*/, Set<Container>> containersByCategory : containersByCategoryMap.entrySet()) {
                Long assetCategoryID = containersByCategory.getKey();
                Set<Container> containers = containersByCategory.getValue();

                Set<AttackStrategy> attackStrategiesByCategorySet = new HashSet<>();

                for (Container container : containers) {
                    attackStrategiesByCategorySet.addAll(attackStrategiesByContainerMap.get(container.getId()));
                }

                attackStrategiesByAssetCategoryMap.put(assetCategoryID, attackStrategiesByCategorySet);
            }

            //OK
            logger.info("AttackStrategies by AssetCategory: " + attackStrategiesByAssetCategoryMap.size());

            //Map used to update the likelihood of an AttackStrategy in time O(1).
            Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap = attackStrategies.stream().collect(Collectors.toMap(AttackStrategy::getId, attackStrategy -> new AugmentedAttackStrategy(attackStrategy, true)));

            //Set the Initial Likelihood for the AttackStrategies
            for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {
                AugmentedAttackStrategy attackStrategy = entry.getValue();
                attackStrategy.setInitialLikelihood(this.attackStrategyCalculator.initialLikelihood(attackStrategy).getValue());
            }

            //Get all the QuestionnaireStatus of the SelfAssessment
            List<QuestionnaireStatus> questionnaireStatuses = this.questionnaireStatusService.findAllBySelfAssessment(selfAssessment.getId());

            //Get the CISO's QuestionnaireStatus
            QuestionnaireStatus cisoQuestionnaireStatus = questionnaireStatuses.stream().filter(questionnaireStatus -> {
                return questionnaireStatus.getQuestionnaire().getPurpose().equals(QuestionnairePurpose.SELFASSESSMENT) && questionnaireStatus.getRole() == Role.ROLE_CISO;
            }).findFirst().orElse(null);

            //Get the ExternalAuditor QuestionnaireStatus
            QuestionnaireStatus externalAuditQuestionnaireStatus = questionnaireStatuses.stream().filter(questionnaireStatus -> {
                return questionnaireStatus.getQuestionnaire().getPurpose().equals(QuestionnairePurpose.SELFASSESSMENT) && questionnaireStatus.getRole() == Role.ROLE_EXTERNAL_AUDIT;
            }).findFirst().orElse(null);

            if (cisoQuestionnaireStatus != null) {
                Questionnaire questionnaire = cisoQuestionnaireStatus.getQuestionnaire();
                List<Question> questions = this.questionService.findAllByQuestionnaire(questionnaire);
                List<Answer> answers = this.answerService.findAll();
                Map<Long/*AnswerID*/, Answer> answersMap = answers.stream().collect(Collectors.toMap(Answer::getId, Function.identity()));
                Map<Long/*QuestionID*/, Question> questionsMap = questions.stream().collect(Collectors.toMap(Question::getId, Function.identity()));

                List<MyAnswer> myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(cisoQuestionnaireStatus.getId());

                this.attackStrategyCalculator.calculateContextualVulnerabilityLikelihoodAndCriticalities(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);
            }

            if (externalAuditQuestionnaireStatus != null) {
                Questionnaire questionnaire = externalAuditQuestionnaireStatus.getQuestionnaire();
                List<Question> questions = this.questionService.findAllByQuestionnaire(questionnaire);
                List<Answer> answers = this.answerService.findAll();
                Map<Long/*AnswerID*/, Answer> answersMap = answers.stream().collect(Collectors.toMap(Answer::getId, Function.identity()));
                Map<Long/*QuestionID*/, Question> questionsMap = questions.stream().collect(Collectors.toMap(Question::getId, Function.identity()));

                List<MyAnswer> myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(externalAuditQuestionnaireStatus.getId());

                this.attackStrategyCalculator.calculateRefinedVulnerabilityLikelihoodAndCriticalities(myAnswers, questionsMap, answersMap, augmentedAttackStrategyMap);
            }

            Map<Long, Set<Long>> attackStrategiesByAssetCategoryIDMap = attackStrategiesByAssetCategoryMap
                .entrySet()
                .stream()
                .collect(
                    Collectors.toMap(
                        entry -> entry.getKey(),
                        entry -> entry
                            .getValue()
                            .stream().map(
                                AttackStrategy::getId
                            ).collect(
                                Collectors.toSet()
                            )
                    )
                );

            IntangibleAssetsAttacksLikelihoodTable likelihoodTable = new IntangibleAssetsAttacksLikelihoodTable(
                augmentedAttackStrategyMap.values().stream().collect(Collectors.toList()),
                intangibleAssetCategories, attackStrategiesByAssetCategoryIDMap

            );

            return likelihoodTable;
        }

        return null;
    }
}
