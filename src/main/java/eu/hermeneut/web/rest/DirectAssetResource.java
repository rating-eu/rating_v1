package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.DirectAsset;
import eu.hermeneut.service.DirectAssetService;
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
 * REST controller for managing DirectAsset.
 */
@RestController
@RequestMapping("/api")
public class DirectAssetResource {

    private final Logger log = LoggerFactory.getLogger(DirectAssetResource.class);

    private static final String ENTITY_NAME = "directAsset";

    private final DirectAssetService directAssetService;

    public DirectAssetResource(DirectAssetService directAssetService) {
        this.directAssetService = directAssetService;
    }

    /**
     * POST  /direct-assets : Create a new directAsset.
     *
     * @param directAsset the directAsset to create
     * @return the ResponseEntity with status 201 (Created) and with body the new directAsset, or with status 400 (Bad Request) if the directAsset has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/direct-assets")
    @Timed
    public ResponseEntity<DirectAsset> createDirectAsset(@RequestBody DirectAsset directAsset) throws URISyntaxException {
        log.debug("REST request to save DirectAsset : {}", directAsset);
        if (directAsset.getId() != null) {
            throw new BadRequestAlertException("A new directAsset cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DirectAsset result = directAssetService.save(directAsset);
        return ResponseEntity.created(new URI("/api/direct-assets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /direct-assets : Updates an existing directAsset.
     *
     * @param directAsset the directAsset to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated directAsset,
     * or with status 400 (Bad Request) if the directAsset is not valid,
     * or with status 500 (Internal Server Error) if the directAsset couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/direct-assets")
    @Timed
    public ResponseEntity<DirectAsset> updateDirectAsset(@RequestBody DirectAsset directAsset) throws URISyntaxException {
        log.debug("REST request to update DirectAsset : {}", directAsset);
        if (directAsset.getId() == null) {
            return createDirectAsset(directAsset);
        }
        DirectAsset result = directAssetService.save(directAsset);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, directAsset.getId().toString()))
            .body(result);
    }

    /**
     * GET  /direct-assets : get all the directAssets.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of directAssets in body
     */
    @GetMapping("/direct-assets")
    @Timed
    public List<DirectAsset> getAllDirectAssets() {
        log.debug("REST request to get all DirectAssets");
        return directAssetService.findAll();
    }

    /**
     * GET  /direct-assets : get all the directAssets by SelfAssessment.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of directAssets in body
     */
    @GetMapping("/{selfAssessmentID}/direct-assets")
    @Timed
    public List<DirectAsset> getAllDirectAssets(@PathVariable("selfAssessmentID") Long selfAssessmentID) {
        log.debug("REST request to get all DirectAssets");
        return directAssetService.findAllBySelfAssessment(selfAssessmentID);
    }

    /**
     * GET  /direct-assets/:id : get the "id" directAsset.
     *
     * @param id the id of the directAsset to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the directAsset, or with status 404 (Not Found)
     */
    @GetMapping("/direct-assets/{id}")
    @Timed
    public ResponseEntity<DirectAsset> getDirectAsset(@PathVariable Long id) {
        log.debug("REST request to get DirectAsset : {}", id);
        DirectAsset directAsset = directAssetService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(directAsset));
    }

    /**
     * DELETE  /direct-assets/:id : delete the "id" directAsset.
     *
     * @param id the id of the directAsset to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/direct-assets/{id}")
    @Timed
    public ResponseEntity<Void> deleteDirectAsset(@PathVariable Long id) {
        log.debug("REST request to delete DirectAsset : {}", id);
        directAssetService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/direct-assets?query=:query : search for the directAsset corresponding
     * to the query.
     *
     * @param query the query of the directAsset search
     * @return the result of the search
     */
    @GetMapping("/_search/direct-assets")
    @Timed
    public List<DirectAsset> searchDirectAssets(@RequestParam String query) {
        log.debug("REST request to search DirectAssets for query {}", query);
        return directAssetService.search(query);
    }

}
