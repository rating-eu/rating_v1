package eu.hermeneut.service;

import eu.hermeneut.domain.Container;
import java.util.List;

/**
 * Service Interface for managing Container.
 */
public interface ContainerService {

    /**
     * Save a container.
     *
     * @param container the entity to save
     * @return the persisted entity
     */
    Container save(Container container);

    /**
     * Get all the containers.
     *
     * @return the list of entities
     */
    List<Container> findAll();

    /**
     * Get the "id" container.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Container findOne(Long id);

    /**
     * Delete the "id" container.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the container corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Container> search(String query);
}
