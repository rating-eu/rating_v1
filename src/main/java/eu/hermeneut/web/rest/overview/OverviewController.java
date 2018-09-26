package eu.hermeneut.web.rest.overview;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.overview.AugmentedMyAsset;
import eu.hermeneut.domain.overview.SelfAssessmentOverview;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.attackstrategy.ThreatAttackFilter;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import eu.hermeneut.web.rest.output.WP3OutputController;
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

@RestController
@RequestMapping("/api")
public class OverviewController {
    private static final Logger LOGGER = LoggerFactory.getLogger(WP3OutputController.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Autowired
    private MyAnswerService myAnswerService;

    @Autowired
    private QuestionnaireStatusService questionnaireStatusService;

    @Autowired
    private AttackStrategyCalculator attackStrategyCalculator;

    @Autowired
    private AnswerCalculator answerCalculator;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AnswerService answerService;

    @GetMapping("{selfAssessmentID}/overview")
    public SelfAssessmentOverview getSelfAssessmentOverview(@PathVariable Long selfAssessmentID) {
        //Get the SelfAssessment by the given ID
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        LOGGER.info("SelfAssessment: " + selfAssessment);

        SelfAssessmentOverview overview = new SelfAssessmentOverview();
        overview.setSelfAssessmentID(selfAssessmentID);

        Set<AugmentedMyAsset> augmentedMyAssets = new HashSet<>();
        overview.setAugmentedMyAssets(augmentedMyAssets);

        if (selfAssessment != null) {
            Set<ThreatAgent> threatAgentSet = selfAssessment.getThreatagents();

            if (threatAgentSet != null && !threatAgentSet.isEmpty()) {
                List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

                if (myAssets != null && !myAssets.isEmpty()) {
                    List<QuestionnaireStatus> questionnaireStatuses = this.questionnaireStatusService.findAllBySelfAssessment(selfAssessmentID);

                    if (questionnaireStatuses != null && !questionnaireStatuses.isEmpty()) {
                        QuestionnaireStatus cisoQStatus = questionnaireStatuses.stream().filter(questionnaireStatus -> questionnaireStatus.getRole().equals(Role.ROLE_CISO) && questionnaireStatus.getQuestionnaire().getPurpose().equals(QuestionnairePurpose.SELFASSESSMENT)).findFirst().orElse(null);
                        QuestionnaireStatus externalQStatus = questionnaireStatuses.stream().filter(questionnaireStatus -> questionnaireStatus.getRole().equals(Role.ROLE_EXTERNAL_AUDIT) && questionnaireStatus.getQuestionnaire().getPurpose().equals(QuestionnairePurpose.SELFASSESSMENT)).findFirst().orElse(null);

                        Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap = this.attackStrategyService.findAll().stream().collect(Collectors.toMap(
                            AttackStrategy::getId,
                            attackStrategy -> new AugmentedAttackStrategy(attackStrategy, true)
                        ));

                        //===INITIAL LIKELIHOOD===
                        augmentedAttackStrategyMap.values().forEach(augmentedAttackStrategy -> {
                            augmentedAttackStrategy.setInitialLikelihood(this.attackStrategyCalculator.initialLikelihood(augmentedAttackStrategy).getValue());
                        });

                        Map<Long, Answer> answerMap = this.answerService.findAll().stream().collect(Collectors.toMap(
                            Answer::getId,
                            Function.identity()
                        ));

                        //===CONTEXTUAL LIKELIHOOD & VULNERABILITY===
                        if (cisoQStatus != null) {
                            List<MyAnswer> myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(cisoQStatus.getId());

                            if (myAnswers != null && !myAnswers.isEmpty()) {
                                List<Question> questions = this.questionService.findAllByQuestionnaire(cisoQStatus.getQuestionnaire());

                                Map<Long, Question> questionMap = questions.stream().collect(Collectors.toMap(
                                    Question::getId,
                                    Function.identity()
                                ));

                                this.attackStrategyCalculator.calculateContextualLikelihoods(myAnswers, questionMap, answerMap, augmentedAttackStrategyMap);
                            }
                        }

                        //===REFINED LIKELIHOOD & VULNERABILITY===
                        if (externalQStatus != null) {
                            List<MyAnswer> myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(externalQStatus.getId());

                            if (myAnswers != null && !myAnswers.isEmpty()) {
                                List<Question> questions = this.questionService.findAllByQuestionnaire(externalQStatus.getQuestionnaire());

                                Map<Long, Question> questionMap = questions.stream().collect(Collectors.toMap(
                                    Question::getId,
                                    Function.identity()
                                ));

                                this.attackStrategyCalculator.calculateRefinedLikelihoods(myAnswers, questionMap, answerMap, augmentedAttackStrategyMap);
                            }
                        }

                        Iterator<MyAsset> myAssetIterator = myAssets.iterator();

                        //===My Assets===
                        while (myAssetIterator.hasNext()) {
                            MyAsset myAsset = myAssetIterator.next();

                            Set<Container> containers = myAsset.getAsset().getContainers();

                            if (containers != null && !containers.isEmpty()) {
                                Iterator<Container> containerIterator = containers.iterator();

                                while (containerIterator.hasNext()) {
                                    Container container = containerIterator.next();
                                    List<AttackStrategy> attackStrategies = this.attackStrategyService.findAllByContainer(container.getId());

                                    if (attackStrategies != null && !attackStrategies.isEmpty()) {
                                        Iterator<AttackStrategy> attackStrategyIterator = attackStrategies.iterator();

                                        while (attackStrategyIterator.hasNext()) {
                                            AttackStrategy attackStrategy = attackStrategyIterator.next();
                                            AugmentedAttackStrategy augmentedAttackStrategy = augmentedAttackStrategyMap.get(attackStrategy.getId());

                                            //TODO Filter the ThreatAgents that can perform this attack
                                            List<ThreatAgent> threatAgentsSubset = threatAgentSet.stream().filter(threatAgent -> ThreatAttackFilter.isAttackPossible(threatAgent, attackStrategy)).collect(Collectors.toList());
                                            //TODO For each ThreatAgent build an AugmentedMyAsset
                                            if (threatAgentsSubset != null && !threatAgentsSubset.isEmpty()) {
                                                Iterator<ThreatAgent> threatAgentIterator = threatAgentsSubset.iterator();

                                                while (threatAgentIterator.hasNext()) {
                                                    ThreatAgent threatAgent = threatAgentIterator.next();

                                                    AugmentedMyAsset augmentedMyAsset = new AugmentedMyAsset(myAsset);
                                                    augmentedMyAsset.setAugmentedAttackStrategy(augmentedAttackStrategy);
                                                    augmentedMyAsset.setThreatAgent(threatAgent);

                                                    augmentedMyAssets.add(augmentedMyAsset);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {

                }
            }
        } else {

        }

        return overview;
    }
}
