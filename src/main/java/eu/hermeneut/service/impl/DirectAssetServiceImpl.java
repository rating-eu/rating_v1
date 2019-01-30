package eu.hermeneut.service.impl;

import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.IndirectAsset;
import eu.hermeneut.service.DirectAssetService;
import eu.hermeneut.domain.DirectAsset;
import eu.hermeneut.repository.DirectAssetRepository;
import eu.hermeneut.repository.search.DirectAssetSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing DirectAsset.
 */
@Service
@Transactional
public class DirectAssetServiceImpl implements DirectAssetService {

    private final Logger log = LoggerFactory.getLogger(DirectAssetServiceImpl.class);

    private final DirectAssetRepository directAssetRepository;

    private final DirectAssetSearchRepository directAssetSearchRepository;

    public DirectAssetServiceImpl(DirectAssetRepository directAssetRepository, DirectAssetSearchRepository directAssetSearchRepository) {
        this.directAssetRepository = directAssetRepository;
        this.directAssetSearchRepository = directAssetSearchRepository;
    }

    /**
     * Save a directAsset.
     *
     * @param directAsset the entity to save
     * @return the persisted entity
     */
    @Override
    public DirectAsset save(DirectAsset directAsset) {
        log.debug("Request to save DirectAsset : {}", directAsset);

        if (directAsset.getId() != null) {
            DirectAsset existingDirectAsset = this.directAssetRepository.findOne(directAsset.getId());

            if (existingDirectAsset != null) {
                //clear its collections in order to keep only the new data
                existingDirectAsset.getEffects().clear();
                this.directAssetRepository.save(existingDirectAsset);
            }
        }

        Set<IndirectAsset> effects = directAsset.getEffects();

        if (effects != null && !effects.isEmpty()) {
            effects.stream().forEach((indirectAsset) -> {
                indirectAsset.setDirectAsset(directAsset);
            });
        }

        DirectAsset result = directAssetRepository.save(directAsset);
        return result;
    }

    /**
     * Get all the directAssets.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<DirectAsset> findAll() {
        log.debug("Request to get all DirectAssets");
        return directAssetRepository.findAll();
    }

    /**
     * Get one directAsset by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public DirectAsset findOne(Long id) {
        log.debug("Request to get DirectAsset : {}", id);
        return directAssetRepository.findOne(id);
    }

    @Override
    public DirectAsset findOneByMyAssetID(Long selfAssessmentID, Long myAssetID) {
        log.debug("Request to get DirectAsset by SelfAssessment ID: {} and andMyAsset ID: {}", selfAssessmentID, myAssetID);
        return directAssetRepository.findOneByMyAssetID(selfAssessmentID, myAssetID);
    }

    /**
     * Delete the directAsset by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DirectAsset : {}", id);
        directAssetRepository.delete(id);
        directAssetSearchRepository.delete(id);
    }

    /**
     * Search for the directAsset corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<DirectAsset> search(String query) {
        log.debug("Request to search DirectAssets for query {}", query);
        return StreamSupport
            .stream(directAssetSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    public List<DirectAsset> findAllBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get all DirectAssets");
        return directAssetRepository.findAllBySelfAssessment(selfAssessmentID);
    }
}
