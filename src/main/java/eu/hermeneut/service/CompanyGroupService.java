package eu.hermeneut.service;

import eu.hermeneut.domain.CompanyGroup;
import java.util.List;

/**
 * Service Interface for managing CompanyGroup.
 */
public interface CompanyGroupService {

    /**
     * Save a companyGroup.
     *
     * @param companyGroup the entity to save
     * @return the persisted entity
     */
    CompanyGroup save(CompanyGroup companyGroup);

    /**
     * Get all the companyGroups.
     *
     * @return the list of entities
     */
    List<CompanyGroup> findAll();

    /**
     * Get the "id" companyGroup.
     *
     * @param id the id of the entity
     * @return the entity
     */
    CompanyGroup findOne(Long id);

    /**
     * Delete the "id" companyGroup.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the companyGroup corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<CompanyGroup> search(String query);
}
