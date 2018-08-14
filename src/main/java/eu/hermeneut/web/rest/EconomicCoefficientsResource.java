package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.EconomicCoefficients;
import eu.hermeneut.service.EconomicCoefficientsService;
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
 * REST controller for managing EconomicCoefficients.
 */
@RestController
@RequestMapping("/api")
public class EconomicCoefficientsResource {

    private final Logger log = LoggerFactory.getLogger(EconomicCoefficientsResource.class);

    private static final String ENTITY_NAME = "economicCoefficients";

    private final EconomicCoefficientsService economicCoefficientsService;

    public EconomicCoefficientsResource(EconomicCoefficientsService economicCoefficientsService) {
        this.economicCoefficientsService = economicCoefficientsService;
    }

    /**
     * POST  /economic-coefficients : Create a new economicCoefficients.
     *
     * @param economicCoefficients the economicCoefficients to create
     * @return the ResponseEntity with status 201 (Created) and with body the new economicCoefficients, or with status 400 (Bad Request) if the economicCoefficients has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/economic-coefficients")
    @Timed
    public ResponseEntity<EconomicCoefficients> createEconomicCoefficients(@RequestBody EconomicCoefficients economicCoefficients) throws URISyntaxException {
        log.debug("REST request to save EconomicCoefficients : {}", economicCoefficients);
        if (economicCoefficients.getId() != null) {
            throw new BadRequestAlertException("A new economicCoefficients cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EconomicCoefficients result = economicCoefficientsService.save(economicCoefficients);
        return ResponseEntity.created(new URI("/api/economic-coefficients/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /economic-coefficients : Updates an existing economicCoefficients.
     *
     * @param economicCoefficients the economicCoefficients to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated economicCoefficients,
     * or with status 400 (Bad Request) if the economicCoefficients is not valid,
     * or with status 500 (Internal Server Error) if the economicCoefficients couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/economic-coefficients")
    @Timed
    public ResponseEntity<EconomicCoefficients> updateEconomicCoefficients(@RequestBody EconomicCoefficients economicCoefficients) throws URISyntaxException {
        log.debug("REST request to update EconomicCoefficients : {}", economicCoefficients);
        if (economicCoefficients.getId() == null) {
            return createEconomicCoefficients(economicCoefficients);
        }
        EconomicCoefficients result = economicCoefficientsService.save(economicCoefficients);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, economicCoefficients.getId().toString()))
            .body(result);
    }

    /**
     * GET  /economic-coefficients : get all the economicCoefficients.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of economicCoefficients in body
     */
    @GetMapping("/economic-coefficients")
    @Timed
    public List<EconomicCoefficients> getAllEconomicCoefficients() {
        log.debug("REST request to get all EconomicCoefficients");
        return economicCoefficientsService.findAll();
        }

    /**
     * GET  /economic-coefficients/:id : get the "id" economicCoefficients.
     *
     * @param id the id of the economicCoefficients to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the economicCoefficients, or with status 404 (Not Found)
     */
    @GetMapping("/economic-coefficients/{id}")
    @Timed
    public ResponseEntity<EconomicCoefficients> getEconomicCoefficients(@PathVariable Long id) {
        log.debug("REST request to get EconomicCoefficients : {}", id);
        EconomicCoefficients economicCoefficients = economicCoefficientsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(economicCoefficients));
    }

    /**
     * DELETE  /economic-coefficients/:id : delete the "id" economicCoefficients.
     *
     * @param id the id of the economicCoefficients to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/economic-coefficients/{id}")
    @Timed
    public ResponseEntity<Void> deleteEconomicCoefficients(@PathVariable Long id) {
        log.debug("REST request to delete EconomicCoefficients : {}", id);
        economicCoefficientsService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/economic-coefficients?query=:query : search for the economicCoefficients corresponding
     * to the query.
     *
     * @param query the query of the economicCoefficients search
     * @return the result of the search
     */
    @GetMapping("/_search/economic-coefficients")
    @Timed
    public List<EconomicCoefficients> searchEconomicCoefficients(@RequestParam String query) {
        log.debug("REST request to search EconomicCoefficients for query {}", query);
        return economicCoefficientsService.search(query);
    }

}
