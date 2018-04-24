package eu.hermeneut.service;

import eu.hermeneut.domain.Department;
import java.util.List;

/**
 * Service Interface for managing Department.
 */
public interface DepartmentService {

    /**
     * Save a department.
     *
     * @param department the entity to save
     * @return the persisted entity
     */
    Department save(Department department);

    /**
     * Get all the departments.
     *
     * @return the list of entities
     */
    List<Department> findAll();

    /**
     * Get the "id" department.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Department findOne(Long id);

    /**
     * Delete the "id" department.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the department corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Department> search(String query);
}
