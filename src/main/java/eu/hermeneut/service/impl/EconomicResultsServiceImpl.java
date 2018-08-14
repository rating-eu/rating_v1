package eu.hermeneut.service.impl;

import eu.hermeneut.service.EconomicResultsService;
import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.repository.EconomicResultsRepository;
import eu.hermeneut.repository.search.EconomicResultsSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing EconomicResults.
 */
@Service
@Transactional
public class EconomicResultsServiceImpl implements EconomicResultsService {

    private final Logger log = LoggerFactory.getLogger(EconomicResultsServiceImpl.class);

    private final EconomicResultsRepository economicResultsRepository;

    private final EconomicResultsSearchRepository economicResultsSearchRepository;

    public EconomicResultsServiceImpl(EconomicResultsRepository economicResultsRepository, EconomicResultsSearchRepository economicResultsSearchRepository) {
        this.economicResultsRepository = economicResultsRepository;
        this.economicResultsSearchRepository = economicResultsSearchRepository;
    }

    /**
     * Save a economicResults.
     *
     * @param economicResults the entity to save
     * @return the persisted entity
     */
    @Override
    public EconomicResults save(EconomicResults economicResults) {
        log.debug("Request to save EconomicResults : {}", economicResults);
        EconomicResults result = economicResultsRepository.save(economicResults);
        economicResultsSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the economicResults.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<EconomicResults> findAll() {
        log.debug("Request to get all EconomicResults");
        return economicResultsRepository.findAll();
    }

    /**
     * Get one economicResults by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public EconomicResults findOne(Long id) {
        log.debug("Request to get EconomicResults : {}", id);
        return economicResultsRepository.findOne(id);
    }

    /**
     * Delete the economicResults by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete EconomicResults : {}", id);
        economicResultsRepository.delete(id);
        economicResultsSearchRepository.delete(id);
    }

    /**
     * Search for the economicResults corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<EconomicResults> search(String query) {
        log.debug("Request to search EconomicResults for query {}", query);
        return StreamSupport
            .stream(economicResultsSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    public EconomicResults findOneBySelfAssessmentID(Long selfAssessmentID) {
        log.debug("Request to get EconomicResults by selfAssessmentID: {}", selfAssessmentID);
        return economicResultsRepository.findOneBySelfAssessmentID(selfAssessmentID);
    }
}
