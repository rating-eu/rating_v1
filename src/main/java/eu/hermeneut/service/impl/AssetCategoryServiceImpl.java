package eu.hermeneut.service.impl;

import eu.hermeneut.domain.enumeration.AssetType;
import eu.hermeneut.service.AssetCategoryService;
import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.repository.AssetCategoryRepository;
import eu.hermeneut.repository.search.AssetCategorySearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing AssetCategory.
 */
@Service
@Transactional
public class AssetCategoryServiceImpl implements AssetCategoryService {

    private final Logger log = LoggerFactory.getLogger(AssetCategoryServiceImpl.class);

    private final AssetCategoryRepository assetCategoryRepository;

    private final AssetCategorySearchRepository assetCategorySearchRepository;

    public AssetCategoryServiceImpl(AssetCategoryRepository assetCategoryRepository, AssetCategorySearchRepository assetCategorySearchRepository) {
        this.assetCategoryRepository = assetCategoryRepository;
        this.assetCategorySearchRepository = assetCategorySearchRepository;
    }

    /**
     * Save a assetCategory.
     *
     * @param assetCategory the entity to save
     * @return the persisted entity
     */
    @Override
    public AssetCategory save(AssetCategory assetCategory) {
        log.debug("Request to save AssetCategory : {}", assetCategory);
        AssetCategory result = assetCategoryRepository.save(assetCategory);
        assetCategorySearchRepository.save(result);
        return result;
    }

    /**
     * Get all the assetCategories.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AssetCategory> findAll() {
        log.debug("Request to get all AssetCategories");
        return assetCategoryRepository.findAll();
    }

    /**
     * Get one assetCategory by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public AssetCategory findOne(Long id) {
        log.debug("Request to get AssetCategory : {}", id);
        return assetCategoryRepository.findOne(id);
    }

    /**
     * Delete the assetCategory by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete AssetCategory : {}", id);
        assetCategoryRepository.delete(id);
        assetCategorySearchRepository.delete(id);
    }

    /**
     * Search for the assetCategory corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AssetCategory> search(String query) {
        log.debug("Request to search AssetCategories for query {}", query);
        return StreamSupport
            .stream(assetCategorySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    /**
     * Get all the assetCategories with the given AssetType..
     *
     * @param assetType the type of the assets to load.
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<AssetCategory> findAllByAssetType(AssetType assetType) {
        return this.assetCategoryRepository.findAllByAssetType(assetType);
    }
}
