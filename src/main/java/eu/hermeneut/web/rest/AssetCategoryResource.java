package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.service.AssetCategoryService;
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
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing AssetCategory.
 */
@RestController
@RequestMapping("/api")
public class AssetCategoryResource {

    private final Logger log = LoggerFactory.getLogger(AssetCategoryResource.class);

    private static final String ENTITY_NAME = "assetCategory";

    private final AssetCategoryService assetCategoryService;

    public AssetCategoryResource(AssetCategoryService assetCategoryService) {
        this.assetCategoryService = assetCategoryService;
    }

    /**
     * POST  /asset-categories : Create a new assetCategory.
     *
     * @param assetCategory the assetCategory to create
     * @return the ResponseEntity with status 201 (Created) and with body the new assetCategory, or with status 400 (Bad Request) if the assetCategory has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/asset-categories")
    @Timed
    public ResponseEntity<AssetCategory> createAssetCategory(@Valid @RequestBody AssetCategory assetCategory) throws URISyntaxException {
        log.debug("REST request to save AssetCategory : {}", assetCategory);
        if (assetCategory.getId() != null) {
            throw new BadRequestAlertException("A new assetCategory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AssetCategory result = assetCategoryService.save(assetCategory);
        return ResponseEntity.created(new URI("/api/asset-categories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /asset-categories : Updates an existing assetCategory.
     *
     * @param assetCategory the assetCategory to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated assetCategory,
     * or with status 400 (Bad Request) if the assetCategory is not valid,
     * or with status 500 (Internal Server Error) if the assetCategory couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/asset-categories")
    @Timed
    public ResponseEntity<AssetCategory> updateAssetCategory(@Valid @RequestBody AssetCategory assetCategory) throws URISyntaxException {
        log.debug("REST request to update AssetCategory : {}", assetCategory);
        if (assetCategory.getId() == null) {
            return createAssetCategory(assetCategory);
        }
        AssetCategory result = assetCategoryService.save(assetCategory);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, assetCategory.getId().toString()))
            .body(result);
    }

    /**
     * GET  /asset-categories : get all the assetCategories.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of assetCategories in body
     */
    @GetMapping("/asset-categories")
    @Timed
    public List<AssetCategory> getAllAssetCategories() {
        log.debug("REST request to get all AssetCategories");
        return assetCategoryService.findAll();
        }

    /**
     * GET  /asset-categories/:id : get the "id" assetCategory.
     *
     * @param id the id of the assetCategory to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the assetCategory, or with status 404 (Not Found)
     */
    @GetMapping("/asset-categories/{id}")
    @Timed
    public ResponseEntity<AssetCategory> getAssetCategory(@PathVariable Long id) {
        log.debug("REST request to get AssetCategory : {}", id);
        AssetCategory assetCategory = assetCategoryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(assetCategory));
    }

    /**
     * DELETE  /asset-categories/:id : delete the "id" assetCategory.
     *
     * @param id the id of the assetCategory to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/asset-categories/{id}")
    @Timed
    public ResponseEntity<Void> deleteAssetCategory(@PathVariable Long id) {
        log.debug("REST request to delete AssetCategory : {}", id);
        assetCategoryService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/asset-categories?query=:query : search for the assetCategory corresponding
     * to the query.
     *
     * @param query the query of the assetCategory search
     * @return the result of the search
     */
    @GetMapping("/_search/asset-categories")
    @Timed
    public List<AssetCategory> searchAssetCategories(@RequestParam String query) {
        log.debug("REST request to search AssetCategories for query {}", query);
        return assetCategoryService.search(query);
    }

}
