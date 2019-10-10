package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.OverallDataRisk;
import eu.hermeneut.service.OverallDataRiskService;
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
 * REST controller for managing OverallDataRisk.
 */
@RestController
@RequestMapping("/api")
public class OverallDataRiskResource {

    private final Logger log = LoggerFactory.getLogger(OverallDataRiskResource.class);

    private static final String ENTITY_NAME = "overallDataRisk";

    private final OverallDataRiskService overallDataRiskService;

    public OverallDataRiskResource(OverallDataRiskService overallDataRiskService) {
        this.overallDataRiskService = overallDataRiskService;
    }

    /**
     * POST  /overall-data-risks : Create a new overallDataRisk.
     *
     * @param overallDataRisk the overallDataRisk to create
     * @return the ResponseEntity with status 201 (Created) and with body the new overallDataRisk, or with status 400 (Bad Request) if the overallDataRisk has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/overall-data-risks")
    @Timed
    public ResponseEntity<OverallDataRisk> createOverallDataRisk(@Valid @RequestBody OverallDataRisk overallDataRisk) throws URISyntaxException {
        log.debug("REST request to save OverallDataRisk : {}", overallDataRisk);
        if (overallDataRisk.getId() != null) {
            throw new BadRequestAlertException("A new overallDataRisk cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OverallDataRisk result = overallDataRiskService.save(overallDataRisk);
        return ResponseEntity.created(new URI("/api/overall-data-risks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /overall-data-risks : Updates an existing overallDataRisk.
     *
     * @param overallDataRisk the overallDataRisk to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated overallDataRisk,
     * or with status 400 (Bad Request) if the overallDataRisk is not valid,
     * or with status 500 (Internal Server Error) if the overallDataRisk couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/overall-data-risks")
    @Timed
    public ResponseEntity<OverallDataRisk> updateOverallDataRisk(@Valid @RequestBody OverallDataRisk overallDataRisk) throws URISyntaxException {
        log.debug("REST request to update OverallDataRisk : {}", overallDataRisk);
        if (overallDataRisk.getId() == null) {
            return createOverallDataRisk(overallDataRisk);
        }
        OverallDataRisk result = overallDataRiskService.save(overallDataRisk);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, overallDataRisk.getId().toString()))
            .body(result);
    }

    /**
     * GET  /overall-data-risks : get all the overallDataRisks.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of overallDataRisks in body
     */
    @GetMapping("/overall-data-risks")
    @Timed
    public List<OverallDataRisk> getAllOverallDataRisks() {
        log.debug("REST request to get all OverallDataRisks");
        return overallDataRiskService.findAll();
        }

    /**
     * GET  /overall-data-risks/:id : get the "id" overallDataRisk.
     *
     * @param id the id of the overallDataRisk to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the overallDataRisk, or with status 404 (Not Found)
     */
    @GetMapping("/overall-data-risks/{id}")
    @Timed
    public ResponseEntity<OverallDataRisk> getOverallDataRisk(@PathVariable Long id) {
        log.debug("REST request to get OverallDataRisk : {}", id);
        OverallDataRisk overallDataRisk = overallDataRiskService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(overallDataRisk));
    }

    /**
     * DELETE  /overall-data-risks/:id : delete the "id" overallDataRisk.
     *
     * @param id the id of the overallDataRisk to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/overall-data-risks/{id}")
    @Timed
    public ResponseEntity<Void> deleteOverallDataRisk(@PathVariable Long id) {
        log.debug("REST request to delete OverallDataRisk : {}", id);
        overallDataRiskService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
