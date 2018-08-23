package eu.hermeneut.service.impl;

import eu.hermeneut.service.EconomicCoefficientsService;
import eu.hermeneut.domain.EconomicCoefficients;
import eu.hermeneut.repository.EconomicCoefficientsRepository;
import eu.hermeneut.repository.search.EconomicCoefficientsSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing EconomicCoefficients.
 */
@Service
@Transactional
public class EconomicCoefficientsServiceImpl implements EconomicCoefficientsService {

    private final Logger log = LoggerFactory.getLogger(EconomicCoefficientsServiceImpl.class);

    private final EconomicCoefficientsRepository economicCoefficientsRepository;

    private final EconomicCoefficientsSearchRepository economicCoefficientsSearchRepository;

    public EconomicCoefficientsServiceImpl(EconomicCoefficientsRepository economicCoefficientsRepository, EconomicCoefficientsSearchRepository economicCoefficientsSearchRepository) {
        this.economicCoefficientsRepository = economicCoefficientsRepository;
        this.economicCoefficientsSearchRepository = economicCoefficientsSearchRepository;
    }

    /**
     * Save a economicCoefficients.
     *
     * @param economicCoefficients the entity to save
     * @return the persisted entity
     */
    @Override
    public EconomicCoefficients save(EconomicCoefficients economicCoefficients) {
        log.debug("Request to save EconomicCoefficients : {}", economicCoefficients);
        EconomicCoefficients result = economicCoefficientsRepository.save(economicCoefficients);
        economicCoefficientsSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the economicCoefficients.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<EconomicCoefficients> findAll() {
        log.debug("Request to get all EconomicCoefficients");
        return economicCoefficientsRepository.findAll();
    }

    /**
     * Get one economicCoefficients by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public EconomicCoefficients findOne(Long id) {
        log.debug("Request to get EconomicCoefficients : {}", id);
        return economicCoefficientsRepository.findOne(id);
    }

    /**
     * Delete the economicCoefficients by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete EconomicCoefficients : {}", id);
        economicCoefficientsRepository.delete(id);
        economicCoefficientsSearchRepository.delete(id);
    }

    /**
     * Search for the economicCoefficients corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<EconomicCoefficients> search(String query) {
        log.debug("Request to search EconomicCoefficients for query {}", query);
        return StreamSupport
            .stream(economicCoefficientsSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
