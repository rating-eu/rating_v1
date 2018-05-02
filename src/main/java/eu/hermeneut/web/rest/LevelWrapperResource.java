package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.LevelWrapper;
import eu.hermeneut.service.LevelWrapperService;
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
 * REST controller for managing LevelWrapper.
 */
@RestController
@RequestMapping("/api")
public class LevelWrapperResource {

    private final Logger log = LoggerFactory.getLogger(LevelWrapperResource.class);

    private static final String ENTITY_NAME = "levelWrapper";

    private final LevelWrapperService levelWrapperService;

    public LevelWrapperResource(LevelWrapperService levelWrapperService) {
        this.levelWrapperService = levelWrapperService;
    }

    /**
     * POST  /level-wrappers : Create a new levelWrapper.
     *
     * @param levelWrapper the levelWrapper to create
     * @return the ResponseEntity with status 201 (Created) and with body the new levelWrapper, or with status 400 (Bad Request) if the levelWrapper has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/level-wrappers")
    @Timed
    public ResponseEntity<LevelWrapper> createLevelWrapper(@RequestBody LevelWrapper levelWrapper) throws URISyntaxException {
        log.debug("REST request to save LevelWrapper : {}", levelWrapper);
        if (levelWrapper.getId() != null) {
            throw new BadRequestAlertException("A new levelWrapper cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LevelWrapper result = levelWrapperService.save(levelWrapper);
        return ResponseEntity.created(new URI("/api/level-wrappers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /level-wrappers : Updates an existing levelWrapper.
     *
     * @param levelWrapper the levelWrapper to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated levelWrapper,
     * or with status 400 (Bad Request) if the levelWrapper is not valid,
     * or with status 500 (Internal Server Error) if the levelWrapper couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/level-wrappers")
    @Timed
    public ResponseEntity<LevelWrapper> updateLevelWrapper(@RequestBody LevelWrapper levelWrapper) throws URISyntaxException {
        log.debug("REST request to update LevelWrapper : {}", levelWrapper);
        if (levelWrapper.getId() == null) {
            return createLevelWrapper(levelWrapper);
        }
        LevelWrapper result = levelWrapperService.save(levelWrapper);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, levelWrapper.getId().toString()))
            .body(result);
    }

    /**
     * GET  /level-wrappers : get all the levelWrappers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of levelWrappers in body
     */
    @GetMapping("/level-wrappers")
    @Timed
    public List<LevelWrapper> getAllLevelWrappers() {
        log.debug("REST request to get all LevelWrappers");
        return levelWrapperService.findAll();
        }

    /**
     * GET  /level-wrappers/:id : get the "id" levelWrapper.
     *
     * @param id the id of the levelWrapper to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the levelWrapper, or with status 404 (Not Found)
     */
    @GetMapping("/level-wrappers/{id}")
    @Timed
    public ResponseEntity<LevelWrapper> getLevelWrapper(@PathVariable Long id) {
        log.debug("REST request to get LevelWrapper : {}", id);
        LevelWrapper levelWrapper = levelWrapperService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(levelWrapper));
    }

    /**
     * DELETE  /level-wrappers/:id : delete the "id" levelWrapper.
     *
     * @param id the id of the levelWrapper to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/level-wrappers/{id}")
    @Timed
    public ResponseEntity<Void> deleteLevelWrapper(@PathVariable Long id) {
        log.debug("REST request to delete LevelWrapper : {}", id);
        levelWrapperService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/level-wrappers?query=:query : search for the levelWrapper corresponding
     * to the query.
     *
     * @param query the query of the levelWrapper search
     * @return the result of the search
     */
    @GetMapping("/_search/level-wrappers")
    @Timed
    public List<LevelWrapper> searchLevelWrappers(@RequestParam String query) {
        log.debug("REST request to search LevelWrappers for query {}", query);
        return levelWrapperService.search(query);
    }

}
