package eu.hermeneut.service.impl;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.overview.AugmentedMyAsset;
import eu.hermeneut.domain.overview.SelfAssessmentOverview;
import eu.hermeneut.service.*;
import eu.hermeneut.repository.SelfAssessmentRepository;
import eu.hermeneut.repository.search.SelfAssessmentSearchRepository;
import eu.hermeneut.service.result.ResultService;
import eu.hermeneut.thread.AugmentedMyAssetsCallable;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import eu.hermeneut.utils.wp4.ListSplitter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing SelfAssessment.
 */
@Service
@Transactional
public class SelfAssessmentServiceImpl implements SelfAssessmentService {

    private final Logger LOGGER = LoggerFactory.getLogger(SelfAssessmentServiceImpl.class);

    private final SelfAssessmentRepository selfAssessmentRepository;

    private final SelfAssessmentSearchRepository selfAssessmentSearchRepository;

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

    @Autowired
    private ResultService resultService;

    public SelfAssessmentServiceImpl(SelfAssessmentRepository selfAssessmentRepository, SelfAssessmentSearchRepository selfAssessmentSearchRepository) {
        this.selfAssessmentRepository = selfAssessmentRepository;
        this.selfAssessmentSearchRepository = selfAssessmentSearchRepository;
    }

    /**
     * Save a selfAssessment.
     *
     * @param selfAssessment the entity to save
     * @return the persisted entity
     */
    @Override
    public SelfAssessment save(SelfAssessment selfAssessment) {
        LOGGER.debug("Request to save SelfAssessment : {}", selfAssessment);
        SelfAssessment result = selfAssessmentRepository.save(selfAssessment);
        selfAssessmentSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the selfAssessments.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SelfAssessment> findAll() {
        LOGGER.debug("Request to get all SelfAssessments");
        List<SelfAssessment> selfAssessments = selfAssessmentRepository.findAllWithEagerRelationships();

        for (SelfAssessment selfAssessment : selfAssessments) {
            Set<ThreatAgent> threatAgents = selfAssessment.getThreatagents();

            if (threatAgents != null) {
                for (ThreatAgent threatAgent : threatAgents) {
                    threatAgent.setImage(null);
                }
            }
        }

        return selfAssessments;
    }

    /**
     * Get one selfAssessment by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public SelfAssessment findOne(Long id) {
        LOGGER.debug("Request to get SelfAssessment : {}", id);
        return selfAssessmentRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the selfAssessment by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        LOGGER.debug("Request to delete SelfAssessment : {}", id);
        selfAssessmentRepository.delete(id);
        selfAssessmentSearchRepository.delete(id);
    }

    /**
     * Search for the selfAssessment corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SelfAssessment> search(String query) {
        LOGGER.debug("Request to search SelfAssessments for query {}", query);
        return StreamSupport
            .stream(selfAssessmentSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    public List<SelfAssessment> findAllByCompanyProfile(Long companyProfileID) {
        LOGGER.debug("Request to get SelfAssessment by CompanyProfile: {}", companyProfileID);
        return selfAssessmentRepository.findAllByCompanyProfile(companyProfileID);
    }

    @Override
    public SelfAssessmentOverview getSelfAssessmentOverview(Long selfAssessmentID) {
        //Get the SelfAssessment by the given ID
        SelfAssessment selfAssessment = this.findOne(selfAssessmentID);
        LOGGER.info("SelfAssessment: " + selfAssessment);

        SelfAssessmentOverview overview = new SelfAssessmentOverview();
        overview.setSelfAssessmentID(selfAssessmentID);

        List<AugmentedMyAsset> augmentedMyAssets = new LinkedList<>();
        overview.setAugmentedMyAssets(augmentedMyAssets);

        if (selfAssessment != null) {
            Set<ThreatAgent> threatAgentSet = selfAssessment.getThreatagents();

            if (threatAgentSet != null && !threatAgentSet.isEmpty()) {
                List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

                if (myAssets != null && !myAssets.isEmpty()) {
                    LOGGER.debug("MyAssets: " + myAssets.size());
                    List<QuestionnaireStatus> questionnaireStatuses = this.questionnaireStatusService.findAllBySelfAssessment(selfAssessmentID);

                    if (questionnaireStatuses != null && !questionnaireStatuses.isEmpty()) {
                        LOGGER.debug("QuestionnaireStatuses: " + questionnaireStatuses.size());
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

                        //===Split MyAssets and handle them in different THREADS===
                        final int MY_ASSETS_PER_SINGLE_THREAD = new Random().nextInt(myAssets.size() / 3) + 2;
                        final int THREADS_PROPOSAL = myAssets.size() / MY_ASSETS_PER_SINGLE_THREAD + 1;
                        final int THREADS_AMOUNT = THREADS_PROPOSAL < myAssets.size() ? THREADS_PROPOSAL : myAssets.size();

                        Map<Integer, List<MyAsset>> splittedMyAssets = ListSplitter.split(myAssets, THREADS_AMOUNT);

                        ExecutorService executor = Executors.newFixedThreadPool(THREADS_AMOUNT);

                        //create a list to hold the Future object associated with Callable
                        List<Future<List<AugmentedMyAsset>>> futureList = new ArrayList<Future<List<AugmentedMyAsset>>>();


                        Map<Long, Float> levelsOfInterestMap = this.resultService.getLevelsOfInterest(selfAssessmentID);

                        if (levelsOfInterestMap != null && !levelsOfInterestMap.isEmpty()) {

                            splittedMyAssets.entrySet().stream().forEach((entry) -> {
                                int cluster = entry.getKey();
                                List<MyAsset> myAssetsSubset = entry.getValue();

                                AugmentedMyAssetsCallable augmentedMyAssetsCallable = new AugmentedMyAssetsCallable(myAssetsSubset, this.attackStrategyService, augmentedAttackStrategyMap, threatAgentSet, levelsOfInterestMap);

                                //submit Callable tasks to be executed by thread pool
                                Future<List<AugmentedMyAsset>> future = executor.submit(augmentedMyAssetsCallable);
                                //add Future to the list, we can get return value using Future
                                futureList.add(future);
                            });
                        }

                        for (Future<List<AugmentedMyAsset>> future : futureList) {
                            try {
                                //Future.get() waits for task to get completed
                                augmentedMyAssets.addAll(future.get());
                            } catch (InterruptedException | ExecutionException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                } else {

                }
            }
        } else {

        }

        LOGGER.debug("AugmentedMyAssets: " + augmentedMyAssets.size());

        return overview;
    }

    @Override
    public List<SelfAssessment> findAllByExternalAudit(ExternalAudit externalAudit) {
        LOGGER.debug("Request to get SelfAssessment by ExternalAudit: {}", externalAudit.getName());
        return selfAssessmentRepository.findAllByExternalAudit(externalAudit);
    }
}
