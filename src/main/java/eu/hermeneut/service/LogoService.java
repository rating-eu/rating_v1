package eu.hermeneut.service;

import eu.hermeneut.domain.Logo;
import java.util.List;

/**
 * Service Interface for managing Logo.
 */
public interface LogoService {

    /**
     * Save a logo.
     *
     * @param logo the entity to save
     * @return the persisted entity
     */
    Logo save(Logo logo);

    /**
     * Get all the logos.
     *
     * @return the list of entities
     */
    List<Logo> findAll();

    /**
     * Get the "id" logo.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Logo findOne(Long id);

    /**
     * Delete the "id" logo.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the logo corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Logo> search(String query);

    /**
     * Get the "Secondary" logo of the system.
     *
     * @return the entity
     */
    Logo getSecondaryLogo();
}
