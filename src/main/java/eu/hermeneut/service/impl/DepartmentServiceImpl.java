package eu.hermeneut.service.impl;

import eu.hermeneut.service.DepartmentService;
import eu.hermeneut.domain.Department;
import eu.hermeneut.repository.DepartmentRepository;
import eu.hermeneut.repository.search.DepartmentSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Department.
 */
@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final Logger log = LoggerFactory.getLogger(DepartmentServiceImpl.class);

    private final DepartmentRepository departmentRepository;

    private final DepartmentSearchRepository departmentSearchRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository, DepartmentSearchRepository departmentSearchRepository) {
        this.departmentRepository = departmentRepository;
        this.departmentSearchRepository = departmentSearchRepository;
    }

    /**
     * Save a department.
     *
     * @param department the entity to save
     * @return the persisted entity
     */
    @Override
    public Department save(Department department) {
        log.debug("Request to save Department : {}", department);
        Department result = departmentRepository.save(department);
        departmentSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the departments.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Department> findAll() {
        log.debug("Request to get all Departments");
        return departmentRepository.findAll();
    }

    /**
     * Get one department by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Department findOne(Long id) {
        log.debug("Request to get Department : {}", id);
        return departmentRepository.findOne(id);
    }

    /**
     * Delete the department by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Department : {}", id);
        departmentRepository.delete(id);
        departmentSearchRepository.delete(id);
    }

    /**
     * Search for the department corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Department> search(String query) {
        log.debug("Request to search Departments for query {}", query);
        return StreamSupport
            .stream(departmentSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
