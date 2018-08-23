package eu.hermeneut.service;

import eu.hermeneut.domain.CompanyProfile;
import java.util.List;

/**
 * Service Interface for managing CompanyProfile.
 */
public interface CompanyProfileService {

    /**
     * Save a companyProfile.
     *
     * @param companyProfile the entity to save
     * @return the persisted entity
     */
    CompanyProfile save(CompanyProfile companyProfile);

    /**
     * Get all the companyProfiles.
     *
     * @return the list of entities
     */
    List<CompanyProfile> findAll();

    /**
     * Get the "id" companyProfile.
     *
     * @param id the id of the entity
     * @return the entity
     */
    CompanyProfile findOne(Long id);

    /**
     * Delete the "id" companyProfile.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the companyProfile corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<CompanyProfile> search(String query);
}
