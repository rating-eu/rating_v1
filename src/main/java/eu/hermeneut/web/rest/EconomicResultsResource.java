package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.service.EconomicResultsService;
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
 * REST controller for managing EconomicResults.
 */
@RestController
@RequestMapping("/api")
public class EconomicResultsResource {

    private final Logger log = LoggerFactory.getLogger(EconomicResultsResource.class);

    private static final String ENTITY_NAME = "economicResults";

    private final EconomicResultsService economicResultsService;

    public EconomicResultsResource(EconomicResultsService economicResultsService) {
        this.economicResultsService = economicResultsService;
    }

    /**
     * POST  /economic-results : Create a new economicResults.
     *
     * @param economicResults the economicResults to create
     * @return the ResponseEntity with status 201 (Created) and with body the new economicResults, or with status 400 (Bad Request) if the economicResults has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/economic-results")
    @Timed
    public ResponseEntity<EconomicResults> createEconomicResults(@RequestBody EconomicResults economicResults) throws URISyntaxException {
        log.debug("REST request to save EconomicResults : {}", economicResults);
        if (economicResults.getId() != null) {
            throw new BadRequestAlertException("A new economicResults cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EconomicResults result = economicResultsService.save(economicResults);
        return ResponseEntity.created(new URI("/api/economic-results/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /economic-results : Updates an existing economicResults.
     *
     * @param economicResults the economicResults to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated economicResults,
     * or with status 400 (Bad Request) if the economicResults is not valid,
     * or with status 500 (Internal Server Error) if the economicResults couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/economic-results")
    @Timed
    public ResponseEntity<EconomicResults> updateEconomicResults(@RequestBody EconomicResults economicResults) throws URISyntaxException {
        log.debug("REST request to update EconomicResults : {}", economicResults);
        if (economicResults.getId() == null) {
            return createEconomicResults(economicResults);
        }
        EconomicResults result = economicResultsService.save(economicResults);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, economicResults.getId().toString()))
            .body(result);
    }

    /**
     * GET  /economic-results : get all the economicResults.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of economicResults in body
     */
    @GetMapping("/economic-results")
    @Timed
    public List<EconomicResults> getAllEconomicResults() {
        log.debug("REST request to get all EconomicResults");
        return economicResultsService.findAll();
        }

    /**
     * GET  /economic-results/:id : get the "id" economicResults.
     *
     * @param id the id of the economicResults to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the economicResults, or with status 404 (Not Found)
     */
    @GetMapping("/economic-results/{id}")
    @Timed
    public ResponseEntity<EconomicResults> getEconomicResults(@PathVariable Long id) {
        log.debug("REST request to get EconomicResults : {}", id);
        EconomicResults economicResults = economicResultsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(economicResults));
    }

    /**
     * DELETE  /economic-results/:id : delete the "id" economicResults.
     *
     * @param id the id of the economicResults to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/economic-results/{id}")
    @Timed
    public ResponseEntity<Void> deleteEconomicResults(@PathVariable Long id) {
        log.debug("REST request to delete EconomicResults : {}", id);
        economicResultsService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/economic-results?query=:query : search for the economicResults corresponding
     * to the query.
     *
     * @param query the query of the economicResults search
     * @return the result of the search
     */
    @GetMapping("/_search/economic-results")
    @Timed
    public List<EconomicResults> searchEconomicResults(@RequestParam String query) {
        log.debug("REST request to search EconomicResults for query {}", query);
        return economicResultsService.search(query);
    }

}
