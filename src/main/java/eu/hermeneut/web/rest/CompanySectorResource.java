package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.CompanySector;
import eu.hermeneut.service.CompanySectorService;
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
 * REST controller for managing CompanySector.
 */
@RestController
@RequestMapping("/api")
public class CompanySectorResource {

    private final Logger log = LoggerFactory.getLogger(CompanySectorResource.class);

    private static final String ENTITY_NAME = "companySector";

    private final CompanySectorService companySectorService;

    public CompanySectorResource(CompanySectorService companySectorService) {
        this.companySectorService = companySectorService;
    }

    /**
     * POST  /company-sectors : Create a new companySector.
     *
     * @param companySector the companySector to create
     * @return the ResponseEntity with status 201 (Created) and with body the new companySector, or with status 400 (Bad Request) if the companySector has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/company-sectors")
    @Timed
    public ResponseEntity<CompanySector> createCompanySector(@Valid @RequestBody CompanySector companySector) throws URISyntaxException {
        log.debug("REST request to save CompanySector : {}", companySector);
        if (companySector.getId() != null) {
            throw new BadRequestAlertException("A new companySector cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompanySector result = companySectorService.save(companySector);
        return ResponseEntity.created(new URI("/api/company-sectors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /company-sectors : Updates an existing companySector.
     *
     * @param companySector the companySector to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated companySector,
     * or with status 400 (Bad Request) if the companySector is not valid,
     * or with status 500 (Internal Server Error) if the companySector couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/company-sectors")
    @Timed
    public ResponseEntity<CompanySector> updateCompanySector(@Valid @RequestBody CompanySector companySector) throws URISyntaxException {
        log.debug("REST request to update CompanySector : {}", companySector);
        if (companySector.getId() == null) {
            return createCompanySector(companySector);
        }
        CompanySector result = companySectorService.save(companySector);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, companySector.getId().toString()))
            .body(result);
    }

    /**
     * GET  /company-sectors : get all the companySectors.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of companySectors in body
     */
    @GetMapping("/company-sectors")
    @Timed
    public List<CompanySector> getAllCompanySectors() {
        log.debug("REST request to get all CompanySectors");
        return companySectorService.findAll();
        }

    /**
     * GET  /company-sectors/:id : get the "id" companySector.
     *
     * @param id the id of the companySector to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the companySector, or with status 404 (Not Found)
     */
    @GetMapping("/company-sectors/{id}")
    @Timed
    public ResponseEntity<CompanySector> getCompanySector(@PathVariable Long id) {
        log.debug("REST request to get CompanySector : {}", id);
        CompanySector companySector = companySectorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(companySector));
    }

    /**
     * DELETE  /company-sectors/:id : delete the "id" companySector.
     *
     * @param id the id of the companySector to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/company-sectors/{id}")
    @Timed
    public ResponseEntity<Void> deleteCompanySector(@PathVariable Long id) {
        log.debug("REST request to delete CompanySector : {}", id);
        companySectorService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/company-sectors?query=:query : search for the companySector corresponding
     * to the query.
     *
     * @param query the query of the companySector search
     * @return the result of the search
     */
    @GetMapping("/_search/company-sectors")
    @Timed
    public List<CompanySector> searchCompanySectors(@RequestParam String query) {
        log.debug("REST request to search CompanySectors for query {}", query);
        return companySectorService.search(query);
    }

}
