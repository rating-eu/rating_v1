package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.DomainOfInfluence;
import eu.hermeneut.service.DomainOfInfluenceService;
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
 * REST controller for managing DomainOfInfluence.
 */
@RestController
@RequestMapping("/api")
public class DomainOfInfluenceResource {

    private final Logger log = LoggerFactory.getLogger(DomainOfInfluenceResource.class);

    private static final String ENTITY_NAME = "domainOfInfluence";

    private final DomainOfInfluenceService domainOfInfluenceService;

    public DomainOfInfluenceResource(DomainOfInfluenceService domainOfInfluenceService) {
        this.domainOfInfluenceService = domainOfInfluenceService;
    }

    /**
     * POST  /domain-of-influences : Create a new domainOfInfluence.
     *
     * @param domainOfInfluence the domainOfInfluence to create
     * @return the ResponseEntity with status 201 (Created) and with body the new domainOfInfluence, or with status 400 (Bad Request) if the domainOfInfluence has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/domain-of-influences")
    @Timed
    public ResponseEntity<DomainOfInfluence> createDomainOfInfluence(@Valid @RequestBody DomainOfInfluence domainOfInfluence) throws URISyntaxException {
        log.debug("REST request to save DomainOfInfluence : {}", domainOfInfluence);
        if (domainOfInfluence.getId() != null) {
            throw new BadRequestAlertException("A new domainOfInfluence cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DomainOfInfluence result = domainOfInfluenceService.save(domainOfInfluence);
        return ResponseEntity.created(new URI("/api/domain-of-influences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /domain-of-influences : Updates an existing domainOfInfluence.
     *
     * @param domainOfInfluence the domainOfInfluence to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated domainOfInfluence,
     * or with status 400 (Bad Request) if the domainOfInfluence is not valid,
     * or with status 500 (Internal Server Error) if the domainOfInfluence couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/domain-of-influences")
    @Timed
    public ResponseEntity<DomainOfInfluence> updateDomainOfInfluence(@Valid @RequestBody DomainOfInfluence domainOfInfluence) throws URISyntaxException {
        log.debug("REST request to update DomainOfInfluence : {}", domainOfInfluence);
        if (domainOfInfluence.getId() == null) {
            return createDomainOfInfluence(domainOfInfluence);
        }
        DomainOfInfluence result = domainOfInfluenceService.save(domainOfInfluence);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, domainOfInfluence.getId().toString()))
            .body(result);
    }

    /**
     * GET  /domain-of-influences : get all the domainOfInfluences.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of domainOfInfluences in body
     */
    @GetMapping("/domain-of-influences")
    @Timed
    public List<DomainOfInfluence> getAllDomainOfInfluences() {
        log.debug("REST request to get all DomainOfInfluences");
        return domainOfInfluenceService.findAll();
        }

    /**
     * GET  /domain-of-influences/:id : get the "id" domainOfInfluence.
     *
     * @param id the id of the domainOfInfluence to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the domainOfInfluence, or with status 404 (Not Found)
     */
    @GetMapping("/domain-of-influences/{id}")
    @Timed
    public ResponseEntity<DomainOfInfluence> getDomainOfInfluence(@PathVariable Long id) {
        log.debug("REST request to get DomainOfInfluence : {}", id);
        DomainOfInfluence domainOfInfluence = domainOfInfluenceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(domainOfInfluence));
    }

    /**
     * DELETE  /domain-of-influences/:id : delete the "id" domainOfInfluence.
     *
     * @param id the id of the domainOfInfluence to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/domain-of-influences/{id}")
    @Timed
    public ResponseEntity<Void> deleteDomainOfInfluence(@PathVariable Long id) {
        log.debug("REST request to delete DomainOfInfluence : {}", id);
        domainOfInfluenceService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/domain-of-influences?query=:query : search for the domainOfInfluence corresponding
     * to the query.
     *
     * @param query the query of the domainOfInfluence search
     * @return the result of the search
     */
    @GetMapping("/_search/domain-of-influences")
    @Timed
    public List<DomainOfInfluence> searchDomainOfInfluences(@RequestParam String query) {
        log.debug("REST request to search DomainOfInfluences for query {}", query);
        return domainOfInfluenceService.search(query);
    }

}
