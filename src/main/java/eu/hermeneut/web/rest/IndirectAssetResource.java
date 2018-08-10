package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.IndirectAsset;
import eu.hermeneut.service.IndirectAssetService;
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
 * REST controller for managing IndirectAsset.
 */
@RestController
@RequestMapping("/api")
public class IndirectAssetResource {

    private final Logger log = LoggerFactory.getLogger(IndirectAssetResource.class);

    private static final String ENTITY_NAME = "indirectAsset";

    private final IndirectAssetService indirectAssetService;

    public IndirectAssetResource(IndirectAssetService indirectAssetService) {
        this.indirectAssetService = indirectAssetService;
    }

    /**
     * POST  /indirect-assets : Create a new indirectAsset.
     *
     * @param indirectAsset the indirectAsset to create
     * @return the ResponseEntity with status 201 (Created) and with body the new indirectAsset, or with status 400 (Bad Request) if the indirectAsset has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/indirect-assets")
    @Timed
    public ResponseEntity<IndirectAsset> createIndirectAsset(@RequestBody IndirectAsset indirectAsset) throws URISyntaxException {
        log.debug("REST request to save IndirectAsset : {}", indirectAsset);
        if (indirectAsset.getId() != null) {
            throw new BadRequestAlertException("A new indirectAsset cannot already have an ID", ENTITY_NAME, "idexists");
        }
        IndirectAsset result = indirectAssetService.save(indirectAsset);
        return ResponseEntity.created(new URI("/api/indirect-assets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /indirect-assets : Updates an existing indirectAsset.
     *
     * @param indirectAsset the indirectAsset to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated indirectAsset,
     * or with status 400 (Bad Request) if the indirectAsset is not valid,
     * or with status 500 (Internal Server Error) if the indirectAsset couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/indirect-assets")
    @Timed
    public ResponseEntity<IndirectAsset> updateIndirectAsset(@RequestBody IndirectAsset indirectAsset) throws URISyntaxException {
        log.debug("REST request to update IndirectAsset : {}", indirectAsset);
        if (indirectAsset.getId() == null) {
            return createIndirectAsset(indirectAsset);
        }
        IndirectAsset result = indirectAssetService.save(indirectAsset);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, indirectAsset.getId().toString()))
            .body(result);
    }

    /**
     * GET  /indirect-assets : get all the indirectAssets.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of indirectAssets in body
     */
    @GetMapping("/indirect-assets")
    @Timed
    public List<IndirectAsset> getAllIndirectAssets() {
        log.debug("REST request to get all IndirectAssets");
        return indirectAssetService.findAll();
    }

    @GetMapping("/indirect-assets/direct-asset/{directAssetID}")
    @Timed
    public List<IndirectAsset> getIndirectAssetsByDirect(@PathVariable Long directAssetID){
        log.debug("REST request to get all IndirectAssets by DirectAsset ID");
        return indirectAssetService.findAllByDirectAsset(directAssetID);
    }

    /**
     * GET  /indirect-assets/:id : get the "id" indirectAsset.
     *
     * @param id the id of the indirectAsset to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the indirectAsset, or with status 404 (Not Found)
     */
    @GetMapping("/indirect-assets/{id}")
    @Timed
    public ResponseEntity<IndirectAsset> getIndirectAsset(@PathVariable Long id) {
        log.debug("REST request to get IndirectAsset : {}", id);
        IndirectAsset indirectAsset = indirectAssetService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(indirectAsset));
    }

    /**
     * DELETE  /indirect-assets/:id : delete the "id" indirectAsset.
     *
     * @param id the id of the indirectAsset to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/indirect-assets/{id}")
    @Timed
    public ResponseEntity<Void> deleteIndirectAsset(@PathVariable Long id) {
        log.debug("REST request to delete IndirectAsset : {}", id);
        indirectAssetService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/indirect-assets?query=:query : search for the indirectAsset corresponding
     * to the query.
     *
     * @param query the query of the indirectAsset search
     * @return the result of the search
     */
    @GetMapping("/_search/indirect-assets")
    @Timed
    public List<IndirectAsset> searchIndirectAssets(@RequestParam String query) {
        log.debug("REST request to search IndirectAssets for query {}", query);
        return indirectAssetService.search(query);
    }

}
