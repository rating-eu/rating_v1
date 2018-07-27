package eu.hermeneut.service.impl;

import eu.hermeneut.service.IndirectAssetService;
import eu.hermeneut.domain.IndirectAsset;
import eu.hermeneut.repository.IndirectAssetRepository;
import eu.hermeneut.repository.search.IndirectAssetSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing IndirectAsset.
 */
@Service
@Transactional
public class IndirectAssetServiceImpl implements IndirectAssetService {

    private final Logger log = LoggerFactory.getLogger(IndirectAssetServiceImpl.class);

    private final IndirectAssetRepository indirectAssetRepository;

    private final IndirectAssetSearchRepository indirectAssetSearchRepository;

    public IndirectAssetServiceImpl(IndirectAssetRepository indirectAssetRepository, IndirectAssetSearchRepository indirectAssetSearchRepository) {
        this.indirectAssetRepository = indirectAssetRepository;
        this.indirectAssetSearchRepository = indirectAssetSearchRepository;
    }

    /**
     * Save a indirectAsset.
     *
     * @param indirectAsset the entity to save
     * @return the persisted entity
     */
    @Override
    public IndirectAsset save(IndirectAsset indirectAsset) {
        log.debug("Request to save IndirectAsset : {}", indirectAsset);
        IndirectAsset result = indirectAssetRepository.save(indirectAsset);
        indirectAssetSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the indirectAssets.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<IndirectAsset> findAll() {
        log.debug("Request to get all IndirectAssets");
        return indirectAssetRepository.findAll();
    }

    /**
     * Get one indirectAsset by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public IndirectAsset findOne(Long id) {
        log.debug("Request to get IndirectAsset : {}", id);
        return indirectAssetRepository.findOne(id);
    }

    /**
     * Delete the indirectAsset by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete IndirectAsset : {}", id);
        indirectAssetRepository.delete(id);
        indirectAssetSearchRepository.delete(id);
    }

    /**
     * Search for the indirectAsset corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<IndirectAsset> search(String query) {
        log.debug("Request to search IndirectAssets for query {}", query);
        return StreamSupport
            .stream(indirectAssetSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
