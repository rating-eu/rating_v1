package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.EBIT;
import eu.hermeneut.service.EBITService;
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
 * REST controller for managing EBIT.
 */
@RestController
@RequestMapping("/api")
public class EBITResource {

    private final Logger log = LoggerFactory.getLogger(EBITResource.class);

    private static final String ENTITY_NAME = "eBIT";

    private final EBITService eBITService;

    public EBITResource(EBITService eBITService) {
        this.eBITService = eBITService;
    }

    /**
     * POST  /ebits : Create a new eBIT.
     *
     * @param eBIT the eBIT to create
     * @return the ResponseEntity with status 201 (Created) and with body the new eBIT, or with status 400 (Bad Request) if the eBIT has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/ebits")
    @Timed
    public ResponseEntity<EBIT> createEBIT(@RequestBody EBIT eBIT) throws URISyntaxException {
        log.debug("REST request to save EBIT : {}", eBIT);
        if (eBIT.getId() != null) {
            throw new BadRequestAlertException("A new eBIT cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EBIT result = eBITService.save(eBIT);
        return ResponseEntity.created(new URI("/api/ebits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /ebits : Updates an existing eBIT.
     *
     * @param eBIT the eBIT to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated eBIT,
     * or with status 400 (Bad Request) if the eBIT is not valid,
     * or with status 500 (Internal Server Error) if the eBIT couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/ebits")
    @Timed
    public ResponseEntity<EBIT> updateEBIT(@RequestBody EBIT eBIT) throws URISyntaxException {
        log.debug("REST request to update EBIT : {}", eBIT);
        if (eBIT.getId() == null) {
            return createEBIT(eBIT);
        }
        EBIT result = eBITService.save(eBIT);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, eBIT.getId().toString()))
            .body(result);
    }

    /**
     * GET  /ebits : get all the eBITS.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of eBITS in body
     */
    @GetMapping("/ebits")
    @Timed
    public List<EBIT> getAllEBITS() {
        log.debug("REST request to get all EBITS");
        return eBITService.findAll();
        }

    /**
     * GET  /ebits/:id : get the "id" eBIT.
     *
     * @param id the id of the eBIT to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the eBIT, or with status 404 (Not Found)
     */
    @GetMapping("/ebits/{id}")
    @Timed
    public ResponseEntity<EBIT> getEBIT(@PathVariable Long id) {
        log.debug("REST request to get EBIT : {}", id);
        EBIT eBIT = eBITService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eBIT));
    }

    /**
     * DELETE  /ebits/:id : delete the "id" eBIT.
     *
     * @param id the id of the eBIT to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/ebits/{id}")
    @Timed
    public ResponseEntity<Void> deleteEBIT(@PathVariable Long id) {
        log.debug("REST request to delete EBIT : {}", id);
        eBITService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/ebits?query=:query : search for the eBIT corresponding
     * to the query.
     *
     * @param query the query of the eBIT search
     * @return the result of the search
     */
    @GetMapping("/_search/ebits")
    @Timed
    public List<EBIT> searchEBITS(@RequestParam String query) {
        log.debug("REST request to search EBITS for query {}", query);
        return eBITService.search(query);
    }

}
