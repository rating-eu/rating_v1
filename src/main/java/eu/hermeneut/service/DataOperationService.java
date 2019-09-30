package eu.hermeneut.service;

import eu.hermeneut.domain.DataOperation;

import java.util.List;

/**
 * Service Interface for managing DataOperation.
 */
public interface DataOperationService {

    /**
     * Save a dataOperation.
     *
     * @param dataOperation the entity to save
     * @return the persisted entity
     */
    DataOperation save(DataOperation dataOperation);

    /**
     * Get all the dataOperations.
     *
     * @return the list of entities
     */
    List<DataOperation> findAll();

    /**
     * Get the "id" dataOperation.
     *
     * @param id the id of the entity
     * @return the entity
     */
    DataOperation findOne(Long id);

    /**
     * Delete the "id" dataOperation.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Get all the dataOperations by CompanyProfileID.
     *
     * @param companyProfileID The ID of the CompanyProfile.
     * @return The list of DataOperations of the given CompanyProfile.
     */
    List<DataOperation> findAllByCompanyProfile(Long companyProfileID);

    /**
     * Get the dataOperation by CompanyProfileID and operationID.
     *
     * @param companyProfileID The ID of the CompanyProfile.
     * @param operationID      The ID of the DataOperation.
     * @return The DataOperation of the given CompanyProfile with the matching ID.
     */
    DataOperation findOneByCompanyProfileAndOperationID(Long companyProfileID, Long operationID);
}
