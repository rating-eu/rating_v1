package eu.hermeneut.service.impl;

import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.service.EconomicResultsService;
import eu.hermeneut.service.ImpactLevelService;
import eu.hermeneut.domain.ImpactLevel;
import eu.hermeneut.repository.ImpactLevelRepository;
import eu.hermeneut.repository.search.ImpactLevelSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing ImpactLevel.
 */
@Service
@Transactional
public class ImpactLevelServiceImpl implements ImpactLevelService {

    private final Logger log = LoggerFactory.getLogger(ImpactLevelServiceImpl.class);

    private final ImpactLevelRepository impactLevelRepository;

    private final ImpactLevelSearchRepository impactLevelSearchRepository;

    @Autowired
    private EconomicResultsService economicResultsService;

    public ImpactLevelServiceImpl(ImpactLevelRepository impactLevelRepository, ImpactLevelSearchRepository impactLevelSearchRepository) {
        this.impactLevelRepository = impactLevelRepository;
        this.impactLevelSearchRepository = impactLevelSearchRepository;
    }

    /**
     * Save a impactLevel.
     *
     * @param impactLevel the entity to save
     * @return the persisted entity
     */
    @Override
    public ImpactLevel save(ImpactLevel impactLevel) {
        log.debug("Request to save ImpactLevel : {}", impactLevel);
        ImpactLevel result = impactLevelRepository.save(impactLevel);
        impactLevelSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the impactLevels.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<ImpactLevel> findAll() {
        log.debug("Request to get all ImpactLevels");
        return impactLevelRepository.findAll();
    }

    /**
     * Get one impactLevel by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public ImpactLevel findOne(Long id) {
        log.debug("Request to get ImpactLevel : {}", id);
        return impactLevelRepository.findOne(id);
    }

    /**
     * Delete the impactLevel by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ImpactLevel : {}", id);
        impactLevelRepository.delete(id);
        impactLevelSearchRepository.delete(id);
    }

    /**
     * Search for the impactLevel corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<ImpactLevel> search(String query) {
        log.debug("Request to search ImpactLevels for query {}", query);
        return StreamSupport
            .stream(impactLevelSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ImpactLevel> findAllBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get all ImpactLevels by SelfAssessment " + selfAssessmentID);
        List<ImpactLevel> levels = impactLevelRepository.findAllBySelfAssessment(selfAssessmentID);

        if (levels == null || levels.isEmpty()) {
            levels = new ArrayList<>();

            EconomicResults results = this.economicResultsService.findOneBySelfAssessmentID(selfAssessmentID);

            if (results != null && results.getIntangibleCapital() != null) {
                final BigDecimal INTANGIBLE_CAPITAL = results.getIntangibleCapital(); //IC
                final int TIGHT_LEVELS = 3;//K
                final int WIDE_LEVELS = 2;//W
                final int LEVELS = TIGHT_LEVELS + WIDE_LEVELS; //N

                //Tight Impact Levels
                for (int impact = 1; impact <= TIGHT_LEVELS; impact++) {
                    final ImpactLevel level = new ImpactLevel();

                    level.setImpact(impact);
                    level.setSelfAssessmentID(selfAssessmentID);

                    final BigDecimal MIN = INTANGIBLE_CAPITAL
                        .divide(new BigDecimal(TIGHT_LEVELS), 2, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal(impact - 1));

                    final BigDecimal MAX = INTANGIBLE_CAPITAL
                        .divide(new BigDecimal(TIGHT_LEVELS), 2, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal(impact));

                    level.setMinLoss(MIN);
                    level.setMaxLoss(MAX);

                    levels.add(level);
                }

                //Wide Impact Levels
                for (int impact = 4; impact <= LEVELS; impact++) {
                    final ImpactLevel level = new ImpactLevel();

                    level.setImpact(impact);
                    level.setSelfAssessmentID(selfAssessmentID);

                    final BigDecimal MIN = INTANGIBLE_CAPITAL
                        .divide(new BigDecimal(WIDE_LEVELS), 2, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal(impact - 1 - 1));

                    final BigDecimal MAX = INTANGIBLE_CAPITAL
                        .divide(new BigDecimal(WIDE_LEVELS), 2, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal(impact - 1));

                    level.setMinLoss(MIN);
                    level.setMaxLoss(MAX);

                    levels.add(level);
                }
            }
        }

        return this.saveAll(levels);
    }

    @Override
    public List<ImpactLevel> saveAll(List<ImpactLevel> impactLevels) {
        log.debug("Request to save ImpactLevel : {}", impactLevels);
        List<ImpactLevel> result = impactLevelRepository.save(impactLevels);
        impactLevelSearchRepository.save(result);
        return result;
    }
}
