package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.OverallDataThreat;
import eu.hermeneut.service.OverallDataThreatService;
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

/**
 * REST controller for managing OverallDataThreat.
 */
@RestController
@RequestMapping("/api")
public class OverallDataThreatResource {

    private final Logger log = LoggerFactory.getLogger(OverallDataThreatResource.class);

    private static final String ENTITY_NAME = "overallDataThreat";

    private final OverallDataThreatService overallDataThreatService;

    public OverallDataThreatResource(OverallDataThreatService overallDataThreatService) {
        this.overallDataThreatService = overallDataThreatService;
    }

    /**
     * POST  /overall-data-threats : Create a new overallDataThreat.
     *
     * @param overallDataThreat the overallDataThreat to create
     * @return the ResponseEntity with status 201 (Created) and with body the new overallDataThreat, or with status 400 (Bad Request) if the overallDataThreat has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/overall-data-threats")
    @Timed
    public ResponseEntity<OverallDataThreat> createOverallDataThreat(@Valid @RequestBody OverallDataThreat overallDataThreat) throws URISyntaxException {
        log.debug("REST request to save OverallDataThreat : {}", overallDataThreat);
        if (overallDataThreat.getId() != null) {
            throw new BadRequestAlertException("A new overallDataThreat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OverallDataThreat result = overallDataThreatService.save(overallDataThreat);
        return ResponseEntity.created(new URI("/api/overall-data-threats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /overall-data-threats : Updates an existing overallDataThreat.
     *
     * @param overallDataThreat the overallDataThreat to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated overallDataThreat,
     * or with status 400 (Bad Request) if the overallDataThreat is not valid,
     * or with status 500 (Internal Server Error) if the overallDataThreat couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/overall-data-threats")
    @Timed
    public ResponseEntity<OverallDataThreat> updateOverallDataThreat(@Valid @RequestBody OverallDataThreat overallDataThreat) throws URISyntaxException {
        log.debug("REST request to update OverallDataThreat : {}", overallDataThreat);
        if (overallDataThreat.getId() == null) {
            return createOverallDataThreat(overallDataThreat);
        }
        OverallDataThreat result = overallDataThreatService.save(overallDataThreat);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, overallDataThreat.getId().toString()))
            .body(result);
    }

    /**
     * GET  /overall-data-threats : get all the overallDataThreats.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of overallDataThreats in body
     */
    @GetMapping("/overall-data-threats")
    @Timed
    public List<OverallDataThreat> getAllOverallDataThreats() {
        log.debug("REST request to get all OverallDataThreats");
        return overallDataThreatService.findAll();
        }

    /**
     * GET  /overall-data-threats/:id : get the "id" overallDataThreat.
     *
     * @param id the id of the overallDataThreat to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the overallDataThreat, or with status 404 (Not Found)
     */
    @GetMapping("/overall-data-threats/{id}")
    @Timed
    public ResponseEntity<OverallDataThreat> getOverallDataThreat(@PathVariable Long id) {
        log.debug("REST request to get OverallDataThreat : {}", id);
        OverallDataThreat overallDataThreat = overallDataThreatService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(overallDataThreat));
    }

    /**
     * DELETE  /overall-data-threats/:id : delete the "id" overallDataThreat.
     *
     * @param id the id of the overallDataThreat to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/overall-data-threats/{id}")
    @Timed
    public ResponseEntity<Void> deleteOverallDataThreat(@PathVariable Long id) {
        log.debug("REST request to delete OverallDataThreat : {}", id);
        overallDataThreatService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
