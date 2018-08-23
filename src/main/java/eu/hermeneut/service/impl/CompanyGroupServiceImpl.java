package eu.hermeneut.service.impl;

import eu.hermeneut.service.CompanyGroupService;
import eu.hermeneut.domain.CompanyGroup;
import eu.hermeneut.repository.CompanyGroupRepository;
import eu.hermeneut.repository.search.CompanyGroupSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing CompanyGroup.
 */
@Service
@Transactional
public class CompanyGroupServiceImpl implements CompanyGroupService {

    private final Logger log = LoggerFactory.getLogger(CompanyGroupServiceImpl.class);

    private final CompanyGroupRepository companyGroupRepository;

    private final CompanyGroupSearchRepository companyGroupSearchRepository;

    public CompanyGroupServiceImpl(CompanyGroupRepository companyGroupRepository, CompanyGroupSearchRepository companyGroupSearchRepository) {
        this.companyGroupRepository = companyGroupRepository;
        this.companyGroupSearchRepository = companyGroupSearchRepository;
    }

    /**
     * Save a companyGroup.
     *
     * @param companyGroup the entity to save
     * @return the persisted entity
     */
    @Override
    public CompanyGroup save(CompanyGroup companyGroup) {
        log.debug("Request to save CompanyGroup : {}", companyGroup);
        CompanyGroup result = companyGroupRepository.save(companyGroup);
        companyGroupSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the companyGroups.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<CompanyGroup> findAll() {
        log.debug("Request to get all CompanyGroups");
        return companyGroupRepository.findAll();
    }

    /**
     * Get one companyGroup by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public CompanyGroup findOne(Long id) {
        log.debug("Request to get CompanyGroup : {}", id);
        return companyGroupRepository.findOne(id);
    }

    /**
     * Delete the companyGroup by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete CompanyGroup : {}", id);
        companyGroupRepository.delete(id);
        companyGroupSearchRepository.delete(id);
    }

    /**
     * Search for the companyGroup corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<CompanyGroup> search(String query) {
        log.debug("Request to search CompanyGroups for query {}", query);
        return StreamSupport
            .stream(companyGroupSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
