package eu.hermeneut.service.impl;

import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.repository.MyAssetRepository;
import eu.hermeneut.repository.search.MyAssetSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing MyAsset.
 */
@Service
@Transactional
public class MyAssetServiceImpl implements MyAssetService {

    private final Logger log = LoggerFactory.getLogger(MyAssetServiceImpl.class);

    private final MyAssetRepository myAssetRepository;

    private final MyAssetSearchRepository myAssetSearchRepository;

    public MyAssetServiceImpl(MyAssetRepository myAssetRepository, MyAssetSearchRepository myAssetSearchRepository) {
        this.myAssetRepository = myAssetRepository;
        this.myAssetSearchRepository = myAssetSearchRepository;
    }

    /**
     * Save a myAsset.
     *
     * @param myAsset the entity to save
     * @return the persisted entity
     */
    @Override
    public MyAsset save(MyAsset myAsset) {
        log.debug("Request to save MyAsset : {}", myAsset);
        MyAsset result = myAssetRepository.save(myAsset);
        myAssetSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the myAssets.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyAsset> findAll() {
        log.debug("Request to get all MyAssets");
        return myAssetRepository.findAll();
    }

    /**
     * Get one myAsset by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public MyAsset findOne(Long id) {
        log.debug("Request to get MyAsset : {}", id);
        return myAssetRepository.findOne(id);
    }

    /**
     * Delete the myAsset by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete MyAsset : {}", id);
        myAssetRepository.delete(id);
        myAssetSearchRepository.delete(id);
    }

    /**
     * Search for the myAsset corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyAsset> search(String query) {
        log.debug("Request to search MyAssets for query {}", query);
        return StreamSupport
            .stream(myAssetSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}