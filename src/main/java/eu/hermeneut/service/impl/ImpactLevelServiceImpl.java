package eu.hermeneut.service.impl;

import eu.hermeneut.service.ImpactLevelService;
import eu.hermeneut.domain.ImpactLevel;
import eu.hermeneut.repository.ImpactLevelRepository;
import eu.hermeneut.repository.search.ImpactLevelSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional(readOnly = true)
    public List<ImpactLevel> findAllBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get all ImpactLevels by SelfAssessment " + selfAssessmentID);
        return impactLevelRepository.findAllBySelfAssessment(selfAssessmentID);
    }

    @Override
    public List<ImpactLevel> saveAll(List<ImpactLevel> impactLevels) {
        log.debug("Request to save ImpactLevel : {}", impactLevels);
        List<ImpactLevel> result = impactLevelRepository.save(impactLevels);
        impactLevelSearchRepository.save(result);
        return result;
    }
}
