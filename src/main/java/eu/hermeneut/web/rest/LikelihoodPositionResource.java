package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.LikelihoodPosition;
import eu.hermeneut.service.LikelihoodPositionService;
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
 * REST controller for managing LikelihoodPosition.
 */
@RestController
@RequestMapping("/api")
public class LikelihoodPositionResource {

    private final Logger log = LoggerFactory.getLogger(LikelihoodPositionResource.class);

    private static final String ENTITY_NAME = "likelihoodPosition";

    private final LikelihoodPositionService likelihoodPositionService;

    public LikelihoodPositionResource(LikelihoodPositionService likelihoodPositionService) {
        this.likelihoodPositionService = likelihoodPositionService;
    }

    /**
     * POST  /likelihood-positions : Create a new likelihoodPosition.
     *
     * @param likelihoodPosition the likelihoodPosition to create
     * @return the ResponseEntity with status 201 (Created) and with body the new likelihoodPosition, or with status 400 (Bad Request) if the likelihoodPosition has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/likelihood-positions")
    @Timed
    public ResponseEntity<LikelihoodPosition> createLikelihoodPosition(@RequestBody LikelihoodPosition likelihoodPosition) throws URISyntaxException {
        log.debug("REST request to save LikelihoodPosition : {}", likelihoodPosition);
        if (likelihoodPosition.getId() != null) {
            throw new BadRequestAlertException("A new likelihoodPosition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LikelihoodPosition result = likelihoodPositionService.save(likelihoodPosition);
        return ResponseEntity.created(new URI("/api/likelihood-positions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /likelihood-positions : Updates an existing likelihoodPosition.
     *
     * @param likelihoodPosition the likelihoodPosition to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated likelihoodPosition,
     * or with status 400 (Bad Request) if the likelihoodPosition is not valid,
     * or with status 500 (Internal Server Error) if the likelihoodPosition couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/likelihood-positions")
    @Timed
    public ResponseEntity<LikelihoodPosition> updateLikelihoodPosition(@RequestBody LikelihoodPosition likelihoodPosition) throws URISyntaxException {
        log.debug("REST request to update LikelihoodPosition : {}", likelihoodPosition);
        if (likelihoodPosition.getId() == null) {
            return createLikelihoodPosition(likelihoodPosition);
        }
        LikelihoodPosition result = likelihoodPositionService.save(likelihoodPosition);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, likelihoodPosition.getId().toString()))
            .body(result);
    }

    /**
     * GET  /likelihood-positions : get all the likelihoodPositions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of likelihoodPositions in body
     */
    @GetMapping("/likelihood-positions")
    @Timed
    public List<LikelihoodPosition> getAllLikelihoodPositions() {
        log.debug("REST request to get all LikelihoodPositions");
        return likelihoodPositionService.findAll();
        }

    /**
     * GET  /likelihood-positions/:id : get the "id" likelihoodPosition.
     *
     * @param id the id of the likelihoodPosition to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the likelihoodPosition, or with status 404 (Not Found)
     */
    @GetMapping("/likelihood-positions/{id}")
    @Timed
    public ResponseEntity<LikelihoodPosition> getLikelihoodPosition(@PathVariable Long id) {
        log.debug("REST request to get LikelihoodPosition : {}", id);
        LikelihoodPosition likelihoodPosition = likelihoodPositionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(likelihoodPosition));
    }

    /**
     * DELETE  /likelihood-positions/:id : delete the "id" likelihoodPosition.
     *
     * @param id the id of the likelihoodPosition to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/likelihood-positions/{id}")
    @Timed
    public ResponseEntity<Void> deleteLikelihoodPosition(@PathVariable Long id) {
        log.debug("REST request to delete LikelihoodPosition : {}", id);
        likelihoodPositionService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/likelihood-positions?query=:query : search for the likelihoodPosition corresponding
     * to the query.
     *
     * @param query the query of the likelihoodPosition search
     * @return the result of the search
     */
    @GetMapping("/_search/likelihood-positions")
    @Timed
    public List<LikelihoodPosition> searchLikelihoodPositions(@RequestParam String query) {
        log.debug("REST request to search LikelihoodPositions for query {}", query);
        return likelihoodPositionService.search(query);
    }

}
