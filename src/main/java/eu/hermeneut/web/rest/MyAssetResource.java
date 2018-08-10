package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.service.MyAssetService;
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
 * REST controller for managing MyAsset.
 */
@RestController
@RequestMapping("/api")
public class MyAssetResource {

    private final Logger log = LoggerFactory.getLogger(MyAssetResource.class);

    private static final String ENTITY_NAME = "myAsset";

    private final MyAssetService myAssetService;

    public MyAssetResource(MyAssetService myAssetService) {
        this.myAssetService = myAssetService;
    }

    /**
     * POST  /my-assets : Create a new myAsset.
     *
     * @param myAsset the myAsset to create
     * @return the ResponseEntity with status 201 (Created) and with body the new myAsset, or with status 400 (Bad Request) if the myAsset has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/my-assets")
    @Timed
    public ResponseEntity<MyAsset> createMyAsset(@RequestBody MyAsset myAsset) throws URISyntaxException {
        log.debug("REST request to save MyAsset : {}", myAsset);
        if (myAsset.getId() != null) {
            throw new BadRequestAlertException("A new myAsset cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MyAsset result = myAssetService.save(myAsset);
        return ResponseEntity.created(new URI("/api/my-assets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /my-assets : Updates an existing myAsset.
     *
     * @param myAsset the myAsset to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated myAsset,
     * or with status 400 (Bad Request) if the myAsset is not valid,
     * or with status 500 (Internal Server Error) if the myAsset couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/my-assets")
    @Timed
    public ResponseEntity<MyAsset> updateMyAsset(@RequestBody MyAsset myAsset) throws URISyntaxException {
        log.debug("REST request to update MyAsset : {}", myAsset);
        if (myAsset.getId() == null) {
            return createMyAsset(myAsset);
        }
        MyAsset result = myAssetService.save(myAsset);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, myAsset.getId().toString()))
            .body(result);
    }

    /**
     * GET  /my-assets : get all the myAssets.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of myAssets in body
     */
    @GetMapping("/my-assets")
    @Timed
    public List<MyAsset> getAllMyAssets() {
        log.debug("REST request to get all MyAssets");
        return myAssetService.findAll();
    }

    @GetMapping("/my-assets/self-assessment/{selfAssessmentID}")
    @Timed
    public List<MyAsset> getMyAssetsBySelfAssessment(@PathVariable Long selfAssessmentID){
        log.debug("REST request to get all MyAssets by SelfAssessment ID");
        return myAssetService.findAllBySelfAssessment(selfAssessmentID);
    }

    /**
     * GET  /my-assets/:id : get the "id" myAsset.
     *
     * @param id the id of the myAsset to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the myAsset, or with status 404 (Not Found)
     */
    @GetMapping("/my-assets/{id}")
    @Timed
    public ResponseEntity<MyAsset> getMyAsset(@PathVariable Long id) {
        log.debug("REST request to get MyAsset : {}", id);
        MyAsset myAsset = myAssetService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(myAsset));
    }

    /**
     * DELETE  /my-assets/:id : delete the "id" myAsset.
     *
     * @param id the id of the myAsset to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/my-assets/{id}")
    @Timed
    public ResponseEntity<Void> deleteMyAsset(@PathVariable Long id) {
        log.debug("REST request to delete MyAsset : {}", id);
        myAssetService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/my-assets?query=:query : search for the myAsset corresponding
     * to the query.
     *
     * @param query the query of the myAsset search
     * @return the result of the search
     */
    @GetMapping("/_search/my-assets")
    @Timed
    public List<MyAsset> searchMyAssets(@RequestParam String query) {
        log.debug("REST request to search MyAssets for query {}", query);
        return myAssetService.search(query);
    }

}
