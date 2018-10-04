package eu.hermeneut.service;

import eu.hermeneut.domain.ImpactLevel;
import java.util.List;

/**
 * Service Interface for managing ImpactLevel.
 */
public interface ImpactLevelService {

    /**
     * Save a impactLevel.
     *
     * @param impactLevel the entity to save
     * @return the persisted entity
     */
    ImpactLevel save(ImpactLevel impactLevel);

    /**
     * Get all the impactLevels.
     *
     * @return the list of entities
     */
    List<ImpactLevel> findAll();

    /**
     * Get the "id" impactLevel.
     *
     * @param id the id of the entity
     * @return the entity
     */
    ImpactLevel findOne(Long id);

    /**
     * Delete the "id" impactLevel.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the impactLevel corresponding to the query.
     *
     * @param query the query of the search
     *
     * @return the list of entities
     */
    List<ImpactLevel> search(String query);

    List<ImpactLevel> findAllBySelfAssessment(Long selfAssessmentID);

    List<ImpactLevel> saveAll(List<ImpactLevel> impactLevels);
}
