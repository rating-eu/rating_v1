package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.CompanyGroup;
import eu.hermeneut.service.CompanyGroupService;
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
 * REST controller for managing CompanyGroup.
 */
@RestController
@RequestMapping("/api")
public class CompanyGroupResource {

    private final Logger log = LoggerFactory.getLogger(CompanyGroupResource.class);

    private static final String ENTITY_NAME = "companyGroup";

    private final CompanyGroupService companyGroupService;

    public CompanyGroupResource(CompanyGroupService companyGroupService) {
        this.companyGroupService = companyGroupService;
    }

    /**
     * POST  /company-groups : Create a new companyGroup.
     *
     * @param companyGroup the companyGroup to create
     * @return the ResponseEntity with status 201 (Created) and with body the new companyGroup, or with status 400 (Bad Request) if the companyGroup has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/company-groups")
    @Timed
    public ResponseEntity<CompanyGroup> createCompanyGroup(@Valid @RequestBody CompanyGroup companyGroup) throws URISyntaxException {
        log.debug("REST request to save CompanyGroup : {}", companyGroup);
        if (companyGroup.getId() != null) {
            throw new BadRequestAlertException("A new companyGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompanyGroup result = companyGroupService.save(companyGroup);
        return ResponseEntity.created(new URI("/api/company-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /company-groups : Updates an existing companyGroup.
     *
     * @param companyGroup the companyGroup to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated companyGroup,
     * or with status 400 (Bad Request) if the companyGroup is not valid,
     * or with status 500 (Internal Server Error) if the companyGroup couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/company-groups")
    @Timed
    public ResponseEntity<CompanyGroup> updateCompanyGroup(@Valid @RequestBody CompanyGroup companyGroup) throws URISyntaxException {
        log.debug("REST request to update CompanyGroup : {}", companyGroup);
        if (companyGroup.getId() == null) {
            return createCompanyGroup(companyGroup);
        }
        CompanyGroup result = companyGroupService.save(companyGroup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, companyGroup.getId().toString()))
            .body(result);
    }

    /**
     * GET  /company-groups : get all the companyGroups.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of companyGroups in body
     */
    @GetMapping("/company-groups")
    @Timed
    public List<CompanyGroup> getAllCompanyGroups() {
        log.debug("REST request to get all CompanyGroups");
        return companyGroupService.findAll();
        }

    /**
     * GET  /company-groups/:id : get the "id" companyGroup.
     *
     * @param id the id of the companyGroup to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the companyGroup, or with status 404 (Not Found)
     */
    @GetMapping("/company-groups/{id}")
    @Timed
    public ResponseEntity<CompanyGroup> getCompanyGroup(@PathVariable Long id) {
        log.debug("REST request to get CompanyGroup : {}", id);
        CompanyGroup companyGroup = companyGroupService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(companyGroup));
    }

    /**
     * DELETE  /company-groups/:id : delete the "id" companyGroup.
     *
     * @param id the id of the companyGroup to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/company-groups/{id}")
    @Timed
    public ResponseEntity<Void> deleteCompanyGroup(@PathVariable Long id) {
        log.debug("REST request to delete CompanyGroup : {}", id);
        companyGroupService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/company-groups?query=:query : search for the companyGroup corresponding
     * to the query.
     *
     * @param query the query of the companyGroup search
     * @return the result of the search
     */
    @GetMapping("/_search/company-groups")
    @Timed
    public List<CompanyGroup> searchCompanyGroups(@RequestParam String query) {
        log.debug("REST request to search CompanyGroups for query {}", query);
        return companyGroupService.search(query);
    }

}
