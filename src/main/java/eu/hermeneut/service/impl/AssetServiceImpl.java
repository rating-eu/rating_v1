package eu.hermeneut.service.impl;

import eu.hermeneut.service.AssetService;
import eu.hermeneut.domain.Asset;
import eu.hermeneut.repository.AssetRepository;
import eu.hermeneut.repository.search.AssetSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Asset.
 */
@Service
@Transactional
public class AssetServiceImpl implements AssetService {

    private final Logger log = LoggerFactory.getLogger(AssetServiceImpl.class);

    private final AssetRepository assetRepository;

    private final AssetSearchRepository assetSearchRepository;

    public AssetServiceImpl(AssetRepository assetRepository, AssetSearchRepository assetSearchRepository) {
        this.assetRepository = assetRepository;
        this.assetSearchRepository = assetSearchRepository;
    }

    /**
     * Save a asset.
     *
     * @param asset the entity to save
     * @return the persisted entity
     */
    @Override
    public Asset save(Asset asset) {
        log.debug("Request to save Asset : {}", asset);
        Asset result = assetRepository.save(asset);
        assetSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the assets.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Asset> findAll() {
        log.debug("Request to get all Assets");
        return assetRepository.findAllWithEagerRelationships();
    }

    /**
     * Get one asset by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Asset findOne(Long id) {
        log.debug("Request to get Asset : {}", id);
        return assetRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the asset by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Asset : {}", id);
        assetRepository.delete(id);
        assetSearchRepository.delete(id);
    }

    /**
     * Search for the asset corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Asset> search(String query) {
        log.debug("Request to search Assets for query {}", query);
        return StreamSupport
            .stream(assetSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
