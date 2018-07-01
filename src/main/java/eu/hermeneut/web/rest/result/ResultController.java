package eu.hermeneut.web.rest.result;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.AnswerLikelihood;
import eu.hermeneut.domain.enumeration.QuestionType;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.result.AttackMap;
import eu.hermeneut.domain.result.AugmentedAttackStrategy;
import eu.hermeneut.domain.result.Result;
import eu.hermeneut.service.*;
import eu.hermeneut.utils.likelihood.LikelihoodCalculator;
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
import java.util.stream.Collectors;

/**
 * REST controller for managing the result.
 */
@RestController
@RequestMapping("/api/result")
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

    @GetMapping("/test")
    @Timed
    public Result getResult() {
        log.debug("REST request to get the RESULT");

        Result result = new Result();
        result.setInitialLikelihood(100);
        result.setContextualLikelihood(500);
        result.setRefinedVulnerability(new HashMap<ThreatAgent, Float>() {
            {
                this.put(new ThreatAgent() {
                    {
                        this.setId(123L);
                        this.setName("The Worst");
                        this.setDescription("I don't need a description.");
                    }
                }, 300F);

                this.put(new ThreatAgent() {
                    {
                        this.setId(456L);
                        this.setName("The Worst Of The Worst");
                        this.setDescription(".");
                    }
                }, 170F);
            }
        });

        return result;
    }

    @GetMapping("/{selfAssessmentID}")
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
            Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap = attackStrategies.stream().collect(Collectors.toMap(AttackStrategy::getId, attackStrategy -> new AugmentedAttackStrategy(attackStrategy)));
            //Set the Initial Likelihood for the AttackStrategies
            for (Map.Entry<Long, AugmentedAttackStrategy> entry : augmentedAttackStrategyMap.entrySet()) {
                AugmentedAttackStrategy attackStrategy = entry.getValue();
                attackStrategy.setInitialLikelihood(LikelihoodCalculator.initialLikelihood(attackStrategy).getValue());
            }

            log.debug("BEGIN AttackMap...");
            AttackMap attackMap = new AttackMap(augmentedAttackStrategyMap);
            log.debug("size: " + attackMap.size());
            log.debug(attackMap.toString());
            log.debug("END AttackMap...");

            //#Output 1 ==> OVERALL INITIAL LIKELIHOOD
            result.setInitialLikelihood(LikelihoodCalculator.overallInitialLikelihoodByThreatAgent(strongestThreatAgent, attackMap));

            List<Level> levels = this.levelService.findAll();
            log.debug("Levels: " + Arrays.toString(levels.toArray()));

            List<Phase> phases = this.phaseService.findAll();
            log.debug("Phases: " + Arrays.toString(phases.toArray()));

            List<AnswerWeight> answerWeights = this.answerWeightService.findAll();

            Map<QuestionType, Map<AnswerLikelihood, AnswerWeight>> answerWeightsMap = new HashMap<>();

            for (AnswerWeight answerWeight : answerWeights) {
                QuestionType questionType = answerWeight.getQuestionType();
                AnswerLikelihood answerLikelihood = answerWeight.getLikelihood();

                if (answerWeightsMap.containsKey(questionType)) {
                    Map<AnswerLikelihood, AnswerWeight> internalMap = answerWeightsMap.get(questionType);

                    internalMap.put(answerLikelihood, answerWeight);
                } else {
                    Map<AnswerLikelihood, AnswerWeight> internalMap = new HashMap<>();
                    internalMap.put(answerLikelihood, answerWeight);
                    answerWeightsMap.put(questionType, internalMap);
                }
            }

            List<QuestionnaireStatus> questionnaireStatuses = this.questionnaireStatusService.findAllBySelfAssessment(selfAssessment.getId());
            QuestionnaireStatus selfAssessmentQuestionnaireStatus = questionnaireStatuses.stream().filter(questionnaireStatus -> {
                return questionnaireStatus.getQuestionnaire().getPurpose().equals(QuestionnairePurpose.SELFASSESSMENT);
            }).findFirst().orElse(null);

            if (selfAssessmentQuestionnaireStatus != null) {
                List<MyAnswer> myAnswers = this.myAnswerService.findAllByQuestionnaireStatus(selfAssessmentQuestionnaireStatus.getId());

                //TODO group the answers by AttackStrategy and find the likelihood for each of them.
            }

            List<AugmentedAttackStrategy> attackMatrix[][][] = new ArrayList[levels.size()][phases.size()][];

        } else {

        }

        return result;
    }
}
