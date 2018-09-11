package eu.hermeneut.service;

import eu.hermeneut.domain.MyCompany;
import java.util.List;

/**
 * Service Interface for managing MyCompany.
 */
public interface MyCompanyService {

    /**
     * Save a myCompany.
     *
     * @param myCompany the entity to save
     * @return the persisted entity
     */
    MyCompany save(MyCompany myCompany);

    /**
     * Get all the myCompanies.
     *
     * @return the list of entities
     */
    List<MyCompany> findAll();

    /**
     * Get the "id" myCompany.
     *
     * @param id the id of the entity
     * @return the entity
     */
    MyCompany findOne(Long id);

    /**
     * Delete the "id" myCompany.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the myCompany corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<MyCompany> search(String query);
}
