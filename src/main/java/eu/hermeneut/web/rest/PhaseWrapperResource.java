package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.PhaseWrapper;
import eu.hermeneut.service.PhaseWrapperService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing PhaseWrapper.
 */
@RestController
@RequestMapping("/api")
public class PhaseWrapperResource {

    private final Logger log = LoggerFactory.getLogger(PhaseWrapperResource.class);

    private static final String ENTITY_NAME = "phaseWrapper";

    private final PhaseWrapperService phaseWrapperService;

    public PhaseWrapperResource(PhaseWrapperService phaseWrapperService) {
        this.phaseWrapperService = phaseWrapperService;
    }

    /**
     * POST  /phase-wrappers : Create a new phaseWrapper.
     *
     * @param phaseWrapper the phaseWrapper to create
     * @return the ResponseEntity with status 201 (Created) and with body the new phaseWrapper, or with status 400 (Bad Request) if the phaseWrapper has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/phase-wrappers")
    @Timed
    public ResponseEntity<PhaseWrapper> createPhaseWrapper(@RequestBody PhaseWrapper phaseWrapper) throws URISyntaxException {
        log.debug("REST request to save PhaseWrapper : {}", phaseWrapper);
        if (phaseWrapper.getId() != null) {
            throw new BadRequestAlertException("A new phaseWrapper cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PhaseWrapper result = phaseWrapperService.save(phaseWrapper);
        return ResponseEntity.created(new URI("/api/phase-wrappers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /phase-wrappers : Updates an existing phaseWrapper.
     *
     * @param phaseWrapper the phaseWrapper to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated phaseWrapper,
     * or with status 400 (Bad Request) if the phaseWrapper is not valid,
     * or with status 500 (Internal Server Error) if the phaseWrapper couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/phase-wrappers")
    @Timed
    public ResponseEntity<PhaseWrapper> updatePhaseWrapper(@RequestBody PhaseWrapper phaseWrapper) throws URISyntaxException {
        log.debug("REST request to update PhaseWrapper : {}", phaseWrapper);
        if (phaseWrapper.getId() == null) {
            return createPhaseWrapper(phaseWrapper);
        }
        PhaseWrapper result = phaseWrapperService.save(phaseWrapper);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, phaseWrapper.getId().toString()))
            .body(result);
    }

    /**
     * GET  /phase-wrappers : get all the phaseWrappers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of phaseWrappers in body
     */
    @GetMapping("/phase-wrappers")
    @Timed
    public List<PhaseWrapper> getAllPhaseWrappers() {
        log.debug("REST request to get all PhaseWrappers");
        return phaseWrapperService.findAll();
        }

    /**
     * GET  /phase-wrappers/:id : get the "id" phaseWrapper.
     *
     * @param id the id of the phaseWrapper to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the phaseWrapper, or with status 404 (Not Found)
     */
    @GetMapping("/phase-wrappers/{id}")
    @Timed
    public ResponseEntity<PhaseWrapper> getPhaseWrapper(@PathVariable Long id) {
        log.debug("REST request to get PhaseWrapper : {}", id);
        PhaseWrapper phaseWrapper = phaseWrapperService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(phaseWrapper));
    }

    /**
     * DELETE  /phase-wrappers/:id : delete the "id" phaseWrapper.
     *
     * @param id the id of the phaseWrapper to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/phase-wrappers/{id}")
    @Timed
    public ResponseEntity<Void> deletePhaseWrapper(@PathVariable Long id) {
        log.debug("REST request to delete PhaseWrapper : {}", id);
        phaseWrapperService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/phase-wrappers?query=:query : search for the phaseWrapper corresponding
     * to the query.
     *
     * @param query the query of the phaseWrapper search
     * @return the result of the search
     */
    @GetMapping("/_search/phase-wrappers")
    @Timed
    public List<PhaseWrapper> searchPhaseWrappers(@RequestParam String query) {
        log.debug("REST request to search PhaseWrappers for query {}", query);
        return phaseWrapperService.search(query);
    }

}
