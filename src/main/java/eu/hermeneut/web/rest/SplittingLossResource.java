package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.SplittingLoss;
import eu.hermeneut.service.SplittingLossService;
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
 * REST controller for managing SplittingLoss.
 */
@RestController
@RequestMapping("/api")
public class SplittingLossResource {

    private final Logger log = LoggerFactory.getLogger(SplittingLossResource.class);

    private static final String ENTITY_NAME = "splittingLoss";

    private final SplittingLossService splittingLossService;

    public SplittingLossResource(SplittingLossService splittingLossService) {
        this.splittingLossService = splittingLossService;
    }

    /**
     * POST  /splitting-losses : Create a new splittingLoss.
     *
     * @param splittingLoss the splittingLoss to create
     * @return the ResponseEntity with status 201 (Created) and with body the new splittingLoss, or with status 400 (Bad Request) if the splittingLoss has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/splitting-losses")
    @Timed
    public ResponseEntity<SplittingLoss> createSplittingLoss(@RequestBody SplittingLoss splittingLoss) throws URISyntaxException {
        log.debug("REST request to save SplittingLoss : {}", splittingLoss);
        if (splittingLoss.getId() != null) {
            throw new BadRequestAlertException("A new splittingLoss cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SplittingLoss result = splittingLossService.save(splittingLoss);
        return ResponseEntity.created(new URI("/api/splitting-losses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /splitting-losses : Updates an existing splittingLoss.
     *
     * @param splittingLoss the splittingLoss to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated splittingLoss,
     * or with status 400 (Bad Request) if the splittingLoss is not valid,
     * or with status 500 (Internal Server Error) if the splittingLoss couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/splitting-losses")
    @Timed
    public ResponseEntity<SplittingLoss> updateSplittingLoss(@RequestBody SplittingLoss splittingLoss) throws URISyntaxException {
        log.debug("REST request to update SplittingLoss : {}", splittingLoss);
        if (splittingLoss.getId() == null) {
            return createSplittingLoss(splittingLoss);
        }
        SplittingLoss result = splittingLossService.save(splittingLoss);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, splittingLoss.getId().toString()))
            .body(result);
    }

    /**
     * GET  /splitting-losses : get all the splittingLosses.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of splittingLosses in body
     */
    @GetMapping("/splitting-losses")
    @Timed
    public List<SplittingLoss> getAllSplittingLosses() {
        log.debug("REST request to get all SplittingLosses");
        return splittingLossService.findAll();
        }

    /**
     * GET  /splitting-losses/:id : get the "id" splittingLoss.
     *
     * @param id the id of the splittingLoss to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the splittingLoss, or with status 404 (Not Found)
     */
    @GetMapping("/splitting-losses/{id}")
    @Timed
    public ResponseEntity<SplittingLoss> getSplittingLoss(@PathVariable Long id) {
        log.debug("REST request to get SplittingLoss : {}", id);
        SplittingLoss splittingLoss = splittingLossService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(splittingLoss));
    }

    /**
     * DELETE  /splitting-losses/:id : delete the "id" splittingLoss.
     *
     * @param id the id of the splittingLoss to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/splitting-losses/{id}")
    @Timed
    public ResponseEntity<Void> deleteSplittingLoss(@PathVariable Long id) {
        log.debug("REST request to delete SplittingLoss : {}", id);
        splittingLossService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/splitting-losses?query=:query : search for the splittingLoss corresponding
     * to the query.
     *
     * @param query the query of the splittingLoss search
     * @return the result of the search
     */
    @GetMapping("/_search/splitting-losses")
    @Timed
    public List<SplittingLoss> searchSplittingLosses(@RequestParam String query) {
        log.debug("REST request to search SplittingLosses for query {}", query);
        return splittingLossService.search(query);
    }

}
