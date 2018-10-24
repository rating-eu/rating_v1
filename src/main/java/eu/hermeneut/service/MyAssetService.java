package eu.hermeneut.service;

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.enumeration.AssetType;

import java.util.List;

/**
 * Service Interface for managing MyAsset.
 */
public interface MyAssetService {

    /**
     * Save a myAsset.
     *
     * @param myAsset the entity to save
     * @return the persisted entity
     */
    MyAsset save(MyAsset myAsset);

    List<MyAsset> saveAll(List<MyAsset> myAssets);

    /**
     * Get all the myAssets.
     *
     * @return the list of entities
     */
    List<MyAsset> findAll();

    /**
     * Get the "id" myAsset.
     *
     * @param id the id of the entity
     * @return the entity
     */
    MyAsset findOne(Long id);

    MyAsset findOneByIDAndSelfAssessment(Long myAssetID, Long selfAssessmentID);

    /**
     * Delete the "id" myAsset.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the myAsset corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    List<MyAsset> search(String query);

    List<MyAsset> findAllBySelfAssessment(Long selfAssessmentID);

    List<MyAsset> findAllBySelfAssessmentAndAssetType(Long selfAssessmentID, AssetType assetType);
}
