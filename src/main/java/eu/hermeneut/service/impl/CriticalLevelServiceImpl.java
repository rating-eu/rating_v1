package eu.hermeneut.service.impl;

import eu.hermeneut.service.CriticalLevelService;
import eu.hermeneut.domain.CriticalLevel;
import eu.hermeneut.repository.CriticalLevelRepository;
import eu.hermeneut.repository.search.CriticalLevelSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing CriticalLevel.
 */
@Service
@Transactional
public class CriticalLevelServiceImpl implements CriticalLevelService {

    private final Logger log = LoggerFactory.getLogger(CriticalLevelServiceImpl.class);

    private final CriticalLevelRepository criticalLevelRepository;

    private final CriticalLevelSearchRepository criticalLevelSearchRepository;

    public CriticalLevelServiceImpl(CriticalLevelRepository criticalLevelRepository, CriticalLevelSearchRepository criticalLevelSearchRepository) {
        this.criticalLevelRepository = criticalLevelRepository;
        this.criticalLevelSearchRepository = criticalLevelSearchRepository;
    }

    /**
     * Save a criticalLevel.
     *
     * @param criticalLevel the entity to save
     * @return the persisted entity
     */
    @Override
    public CriticalLevel save(CriticalLevel criticalLevel) {
        log.debug("Request to save CriticalLevel : {}", criticalLevel);
        CriticalLevel result = criticalLevelRepository.save(criticalLevel);
        criticalLevelSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the criticalLevels.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<CriticalLevel> findAll() {
        log.debug("Request to get all CriticalLevels");
        return criticalLevelRepository.findAll();
    }

    /**
     * Get one criticalLevel by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public CriticalLevel findOne(Long id) {
        log.debug("Request to get CriticalLevel : {}", id);
        return criticalLevelRepository.findOne(id);
    }

    /**
     * Delete the criticalLevel by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete CriticalLevel : {}", id);
        criticalLevelRepository.delete(id);
        criticalLevelSearchRepository.delete(id);
    }

    /**
     * Search for the criticalLevel corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<CriticalLevel> search(String query) {
        log.debug("Request to search CriticalLevels for query {}", query);
        return StreamSupport
            .stream(criticalLevelSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CriticalLevel findOneBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get CriticalLevel by SelfAssessment ID: {}", selfAssessmentID);
        return criticalLevelRepository.findOneBySelfAssessment(selfAssessmentID);
    }
}
