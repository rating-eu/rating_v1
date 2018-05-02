package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.Department;
import eu.hermeneut.service.DepartmentService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Department.
 */
@RestController
@RequestMapping("/api")
public class DepartmentResource {

    private final Logger log = LoggerFactory.getLogger(DepartmentResource.class);

    private static final String ENTITY_NAME = "department";

    private final DepartmentService departmentService;

    public DepartmentResource(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    /**
     * POST  /departments : Create a new department.
     *
     * @param department the department to create
     * @return the ResponseEntity with status 201 (Created) and with body the new department, or with status 400 (Bad Request) if the department has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/departments")
    @Timed
    public ResponseEntity<Department> createDepartment(@Valid @RequestBody Department department) throws URISyntaxException {
        log.debug("REST request to save Department : {}", department);
        if (department.getId() != null) {
            throw new BadRequestAlertException("A new department cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Department result = departmentService.save(department);
        return ResponseEntity.created(new URI("/api/departments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /departments : Updates an existing department.
     *
     * @param department the department to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated department,
     * or with status 400 (Bad Request) if the department is not valid,
     * or with status 500 (Internal Server Error) if the department couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/departments")
    @Timed
    public ResponseEntity<Department> updateDepartment(@Valid @RequestBody Department department) throws URISyntaxException {
        log.debug("REST request to update Department : {}", department);
        if (department.getId() == null) {
            return createDepartment(department);
        }
        Department result = departmentService.save(department);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, department.getId().toString()))
            .body(result);
    }

    /**
     * GET  /departments : get all the departments.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of departments in body
     */
    @GetMapping("/departments")
    @Timed
    public List<Department> getAllDepartments() {
        log.debug("REST request to get all Departments");
        return departmentService.findAll();
        }

    /**
     * GET  /departments/:id : get the "id" department.
     *
     * @param id the id of the department to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the department, or with status 404 (Not Found)
     */
    @GetMapping("/departments/{id}")
    @Timed
    public ResponseEntity<Department> getDepartment(@PathVariable Long id) {
        log.debug("REST request to get Department : {}", id);
        Department department = departmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(department));
    }

    /**
     * DELETE  /departments/:id : delete the "id" department.
     *
     * @param id the id of the department to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/departments/{id}")
    @Timed
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        log.debug("REST request to delete Department : {}", id);
        departmentService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/departments?query=:query : search for the department corresponding
     * to the query.
     *
     * @param query the query of the department search
     * @return the result of the search
     */
    @GetMapping("/_search/departments")
    @Timed
    public List<Department> searchDepartments(@RequestParam String query) {
        log.debug("REST request to search Departments for query {}", query);
        return departmentService.search(query);
    }

}
