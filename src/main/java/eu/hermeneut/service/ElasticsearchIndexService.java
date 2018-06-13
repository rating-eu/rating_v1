package eu.hermeneut.service;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.hermeneut.domain.*;
import eu.hermeneut.repository.*;
import eu.hermeneut.repository.search.*;
import org.elasticsearch.indices.IndexAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.ManyToMany;
import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ElasticsearchIndexService {

    private static final Lock reindexLock = new ReentrantLock();

    private final Logger log = LoggerFactory.getLogger(ElasticsearchIndexService.class);

    private final AnswerRepository answerRepository;

    private final AnswerSearchRepository answerSearchRepository;

    private final AnswerWeightRepository answerWeightRepository;

    private final AnswerWeightSearchRepository answerWeightSearchRepository;

    private final AssetRepository assetRepository;

    private final AssetSearchRepository assetSearchRepository;

    private final AssetCategoryRepository assetCategoryRepository;

    private final AssetCategorySearchRepository assetCategorySearchRepository;

    private final AttackStrategyRepository attackStrategyRepository;

    private final AttackStrategySearchRepository attackStrategySearchRepository;

    private final CompanyGroupRepository companyGroupRepository;

    private final CompanyGroupSearchRepository companyGroupSearchRepository;

    private final CompanyProfileRepository companyProfileRepository;

    private final CompanyProfileSearchRepository companyProfileSearchRepository;

    private final ContainerRepository containerRepository;

    private final ContainerSearchRepository containerSearchRepository;

    private final DomainOfInfluenceRepository domainOfInfluenceRepository;

    private final DomainOfInfluenceSearchRepository domainOfInfluenceSearchRepository;

    private final ExternalAuditRepository externalAuditRepository;

    private final ExternalAuditSearchRepository externalAuditSearchRepository;

    private final LevelRepository levelRepository;

    private final LevelSearchRepository levelSearchRepository;

    private final LevelWrapperRepository levelWrapperRepository;

    private final LevelWrapperSearchRepository levelWrapperSearchRepository;

    private final LikelihoodPositionRepository likelihoodPositionRepository;

    private final LikelihoodPositionSearchRepository likelihoodPositionSearchRepository;

    private final MitigationRepository mitigationRepository;

    private final MitigationSearchRepository mitigationSearchRepository;

    private final MotivationRepository motivationRepository;

    private final MotivationSearchRepository motivationSearchRepository;

    private final MyAnswerRepository myAnswerRepository;

    private final MyAnswerSearchRepository myAnswerSearchRepository;

    private final PhaseRepository phaseRepository;

    private final PhaseSearchRepository phaseSearchRepository;

    private final PhaseWrapperRepository phaseWrapperRepository;

    private final PhaseWrapperSearchRepository phaseWrapperSearchRepository;

    private final QuestionRepository questionRepository;

    private final QuestionSearchRepository questionSearchRepository;

    private final QuestionnaireRepository questionnaireRepository;

    private final QuestionnaireSearchRepository questionnaireSearchRepository;

    private final QuestionnaireStatusRepository questionnaireStatusRepository;

    private final QuestionnaireStatusSearchRepository questionnaireStatusSearchRepository;

    private final SelfAssessmentRepository selfAssessmentRepository;

    private final SelfAssessmentSearchRepository selfAssessmentSearchRepository;

    private final ThreatAgentRepository threatAgentRepository;

    private final ThreatAgentSearchRepository threatAgentSearchRepository;

    private final UserRepository userRepository;

    private final UserSearchRepository userSearchRepository;

    private final ElasticsearchTemplate elasticsearchTemplate;

    public ElasticsearchIndexService(
        UserRepository userRepository,
        UserSearchRepository userSearchRepository,
        AnswerRepository answerRepository,
        AnswerSearchRepository answerSearchRepository,
        AnswerWeightRepository answerWeightRepository,
        AnswerWeightSearchRepository answerWeightSearchRepository,
        AssetRepository assetRepository,
        AssetSearchRepository assetSearchRepository,
        AssetCategoryRepository assetCategoryRepository,
        AssetCategorySearchRepository assetCategorySearchRepository,
        AttackStrategyRepository attackStrategyRepository,
        AttackStrategySearchRepository attackStrategySearchRepository,
        CompanyGroupRepository companyGroupRepository,
        CompanyGroupSearchRepository companyGroupSearchRepository,
        CompanyProfileRepository companyProfileRepository,
        CompanyProfileSearchRepository companyProfileSearchRepository,
        ContainerRepository containerRepository,
        ContainerSearchRepository containerSearchRepository,
        DomainOfInfluenceRepository domainOfInfluenceRepository,
        DomainOfInfluenceSearchRepository domainOfInfluenceSearchRepository,
        ExternalAuditRepository externalAuditRepository,
        ExternalAuditSearchRepository externalAuditSearchRepository,
        LevelRepository levelRepository,
        LevelSearchRepository levelSearchRepository,
        LevelWrapperRepository levelWrapperRepository,
        LevelWrapperSearchRepository levelWrapperSearchRepository,
        LikelihoodPositionRepository likelihoodPositionRepository,
        LikelihoodPositionSearchRepository likelihoodPositionSearchRepository,
        MitigationRepository mitigationRepository,
        MitigationSearchRepository mitigationSearchRepository,
        MotivationRepository motivationRepository,
        MotivationSearchRepository motivationSearchRepository,
        MyAnswerRepository myAnswerRepository,
        MyAnswerSearchRepository myAnswerSearchRepository,
        PhaseRepository phaseRepository,
        PhaseSearchRepository phaseSearchRepository,
        PhaseWrapperRepository phaseWrapperRepository,
        PhaseWrapperSearchRepository phaseWrapperSearchRepository,
        QuestionRepository questionRepository,
        QuestionSearchRepository questionSearchRepository,
        QuestionnaireRepository questionnaireRepository,
        QuestionnaireSearchRepository questionnaireSearchRepository,
        QuestionnaireStatusRepository questionnaireStatusRepository,
        QuestionnaireStatusSearchRepository questionnaireStatusSearchRepository,
        SelfAssessmentRepository selfAssessmentRepository,
        SelfAssessmentSearchRepository selfAssessmentSearchRepository,
        ThreatAgentRepository threatAgentRepository,
        ThreatAgentSearchRepository threatAgentSearchRepository,
        ElasticsearchTemplate elasticsearchTemplate) {
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.answerRepository = answerRepository;
        this.answerSearchRepository = answerSearchRepository;
        this.answerWeightRepository = answerWeightRepository;
        this.answerWeightSearchRepository = answerWeightSearchRepository;
        this.assetRepository = assetRepository;
        this.assetSearchRepository = assetSearchRepository;
        this.assetCategoryRepository = assetCategoryRepository;
        this.assetCategorySearchRepository = assetCategorySearchRepository;
        this.attackStrategyRepository = attackStrategyRepository;
        this.attackStrategySearchRepository = attackStrategySearchRepository;
        this.companyGroupRepository = companyGroupRepository;
        this.companyGroupSearchRepository = companyGroupSearchRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.companyProfileSearchRepository = companyProfileSearchRepository;
        this.containerRepository = containerRepository;
        this.containerSearchRepository = containerSearchRepository;
        this.domainOfInfluenceRepository = domainOfInfluenceRepository;
        this.domainOfInfluenceSearchRepository = domainOfInfluenceSearchRepository;
        this.externalAuditRepository = externalAuditRepository;
        this.externalAuditSearchRepository = externalAuditSearchRepository;
        this.levelRepository = levelRepository;
        this.levelSearchRepository = levelSearchRepository;
        this.levelWrapperRepository = levelWrapperRepository;
        this.levelWrapperSearchRepository = levelWrapperSearchRepository;
        this.likelihoodPositionRepository = likelihoodPositionRepository;
        this.likelihoodPositionSearchRepository = likelihoodPositionSearchRepository;
        this.mitigationRepository = mitigationRepository;
        this.mitigationSearchRepository = mitigationSearchRepository;
        this.motivationRepository = motivationRepository;
        this.motivationSearchRepository = motivationSearchRepository;
        this.myAnswerRepository = myAnswerRepository;
        this.myAnswerSearchRepository = myAnswerSearchRepository;
        this.phaseRepository = phaseRepository;
        this.phaseSearchRepository = phaseSearchRepository;
        this.phaseWrapperRepository = phaseWrapperRepository;
        this.phaseWrapperSearchRepository = phaseWrapperSearchRepository;
        this.questionRepository = questionRepository;
        this.questionSearchRepository = questionSearchRepository;
        this.questionnaireRepository = questionnaireRepository;
        this.questionnaireSearchRepository = questionnaireSearchRepository;
        this.questionnaireStatusRepository = questionnaireStatusRepository;
        this.questionnaireStatusSearchRepository = questionnaireStatusSearchRepository;
        this.selfAssessmentRepository = selfAssessmentRepository;
        this.selfAssessmentSearchRepository = selfAssessmentSearchRepository;
        this.threatAgentRepository = threatAgentRepository;
        this.threatAgentSearchRepository = threatAgentSearchRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Async
    @Timed
    public void reindexAll() {
        if (reindexLock.tryLock()) {
            try {
                reindexForClass(Answer.class, answerRepository, answerSearchRepository);
                reindexForClass(AnswerWeight.class, answerWeightRepository, answerWeightSearchRepository);
                reindexForClass(Asset.class, assetRepository, assetSearchRepository);
                reindexForClass(AssetCategory.class, assetCategoryRepository, assetCategorySearchRepository);
                reindexForClass(AttackStrategy.class, attackStrategyRepository, attackStrategySearchRepository);
                reindexForClass(CompanyGroup.class, companyGroupRepository, companyGroupSearchRepository);
                reindexForClass(CompanyProfile.class, companyProfileRepository, companyProfileSearchRepository);
                reindexForClass(Container.class, containerRepository, containerSearchRepository);
                reindexForClass(DomainOfInfluence.class, domainOfInfluenceRepository, domainOfInfluenceSearchRepository);
                reindexForClass(ExternalAudit.class, externalAuditRepository, externalAuditSearchRepository);
                reindexForClass(Level.class, levelRepository, levelSearchRepository);
                reindexForClass(LevelWrapper.class, levelWrapperRepository, levelWrapperSearchRepository);
                reindexForClass(LikelihoodPosition.class, likelihoodPositionRepository, likelihoodPositionSearchRepository);
                reindexForClass(Mitigation.class, mitigationRepository, mitigationSearchRepository);
                reindexForClass(Motivation.class, motivationRepository, motivationSearchRepository);
                reindexForClass(MyAnswer.class, myAnswerRepository, myAnswerSearchRepository);
                reindexForClass(Phase.class, phaseRepository, phaseSearchRepository);
                reindexForClass(PhaseWrapper.class, phaseWrapperRepository, phaseWrapperSearchRepository);
                reindexForClass(Question.class, questionRepository, questionSearchRepository);
                reindexForClass(Questionnaire.class, questionnaireRepository, questionnaireSearchRepository);
                reindexForClass(QuestionnaireStatus.class, questionnaireStatusRepository, questionnaireStatusSearchRepository);
                reindexForClass(SelfAssessment.class, selfAssessmentRepository, selfAssessmentSearchRepository);
                reindexForClass(ThreatAgent.class, threatAgentRepository, threatAgentSearchRepository);
                reindexForClass(User.class, userRepository, userSearchRepository);

                log.info("Elasticsearch: Successfully performed reindexing");
            } finally {
                reindexLock.unlock();
            }
        } else {
            log.info("Elasticsearch: concurrent reindexing attempt");
        }
    }

    @SuppressWarnings("unchecked")
    private <T, ID extends Serializable> void reindexForClass(Class<T> entityClass, JpaRepository<T, ID> jpaRepository,
                                                              ElasticsearchRepository<T, ID> elasticsearchRepository) {
        elasticsearchTemplate.deleteIndex(entityClass);
        try {
            elasticsearchTemplate.createIndex(entityClass);
        } catch (IndexAlreadyExistsException e) {
            // Do nothing. Index was already concurrently recreated by some other service.
        }
        elasticsearchTemplate.putMapping(entityClass);
        if (jpaRepository.count() > 0) {
            // if a JHipster entity field is the owner side of a many-to-many relationship, it should be loaded manually
            List<Method> relationshipGetters = Arrays.stream(entityClass.getDeclaredFields())
                .filter(field -> field.getType().equals(Set.class))
                .filter(field -> field.getAnnotation(ManyToMany.class) != null)
                .filter(field -> field.getAnnotation(ManyToMany.class).mappedBy().isEmpty())
                .filter(field -> field.getAnnotation(JsonIgnore.class) == null)
                .map(field -> {
                    try {
                        return new PropertyDescriptor(field.getName(), entityClass).getReadMethod();
                    } catch (IntrospectionException e) {
                        log.error("Error retrieving getter for class {}, field {}. Field will NOT be indexed",
                            entityClass.getSimpleName(), field.getName(), e);
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

            int size = 100;
            for (int i = 0; i <= jpaRepository.count() / size; i++) {
                Pageable page = new PageRequest(i, size);
                log.info("Indexing page {} of {}, size {}", i, jpaRepository.count() / size, size);
                Page<T> results = jpaRepository.findAll(page);
                results.map(result -> {
                    // if there are any relationships to load, do it now
                    relationshipGetters.forEach(method -> {
                        try {
                            // eagerly load the relationship set
                            ((Set) method.invoke(result)).size();
                        } catch (Exception ex) {
                            log.error(ex.getMessage());
                        }
                    });
                    return result;
                });
                elasticsearchRepository.save(results.getContent());
            }
        }
        log.info("Elasticsearch: Indexed all rows for {}", entityClass.getSimpleName());
    }
}
