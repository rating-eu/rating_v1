package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.SecurityImpact;
import eu.hermeneut.service.SecurityImpactService;
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

/**
 * REST controller for managing SecurityImpact.
 */
@RestController
@RequestMapping("/api")
public class SecurityImpactResource {

    private final Logger log = LoggerFactory.getLogger(SecurityImpactResource.class);

    private static final String ENTITY_NAME = "securityImpact";

    private final SecurityImpactService securityImpactService;

    public SecurityImpactResource(SecurityImpactService securityImpactService) {
        this.securityImpactService = securityImpactService;
    }

    /**
     * POST  /security-impacts : Create a new securityImpact.
     *
     * @param securityImpact the securityImpact to create
     * @return the ResponseEntity with status 201 (Created) and with body the new securityImpact, or with status 400 (Bad Request) if the securityImpact has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/security-impacts")
    @Timed
    public ResponseEntity<SecurityImpact> createSecurityImpact(@Valid @RequestBody SecurityImpact securityImpact) throws URISyntaxException {
        log.debug("REST request to save SecurityImpact : {}", securityImpact);
        if (securityImpact.getId() != null) {
            throw new BadRequestAlertException("A new securityImpact cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SecurityImpact result = securityImpactService.save(securityImpact);
        return ResponseEntity.created(new URI("/api/security-impacts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /security-impacts : Updates an existing securityImpact.
     *
     * @param securityImpact the securityImpact to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated securityImpact,
     * or with status 400 (Bad Request) if the securityImpact is not valid,
     * or with status 500 (Internal Server Error) if the securityImpact couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/security-impacts")
    @Timed
    public ResponseEntity<SecurityImpact> updateSecurityImpact(@Valid @RequestBody SecurityImpact securityImpact) throws URISyntaxException {
        log.debug("REST request to update SecurityImpact : {}", securityImpact);
        if (securityImpact.getId() == null) {
            return createSecurityImpact(securityImpact);
        }
        SecurityImpact result = securityImpactService.save(securityImpact);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, securityImpact.getId().toString()))
            .body(result);
    }

    /**
     * GET  /security-impacts : get all the securityImpacts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of securityImpacts in body
     */
    @GetMapping("/security-impacts")
    @Timed
    public List<SecurityImpact> getAllSecurityImpacts() {
        log.debug("REST request to get all SecurityImpacts");
        return securityImpactService.findAll();
    }

    /**
     * GET  /security-impacts/operation/:operationID : get all the securityImpacts of the given DataOperation.
     *
     * @param operationID The iD of the DataOperation
     * @return the ResponseEntity with status 200 (OK) and the list of securityImpacts in body
     */
    @GetMapping("/security-impacts/operation/{operationID}")
    @Timed
    public List<SecurityImpact> getAllSecurityImpactsByDataOperation(@PathVariable Long operationID) {
        log.debug("REST request to get all SecurityImpacts");
        return securityImpactService.findAllByDataOperation(operationID);
    }

    /**
     * GET  /security-impacts/:id : get the "id" securityImpact.
     *
     * @param id the id of the securityImpact to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the securityImpact, or with status 404 (Not Found)
     */
    @GetMapping("/security-impacts/{id}")
    @Timed
    public ResponseEntity<SecurityImpact> getSecurityImpact(@PathVariable Long id) {
        log.debug("REST request to get SecurityImpact : {}", id);
        SecurityImpact securityImpact = securityImpactService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(securityImpact));
    }

    /**
     * DELETE  /security-impacts/:id : delete the "id" securityImpact.
     *
     * @param id the id of the securityImpact to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/security-impacts/{id}")
    @Timed
    public ResponseEntity<Void> deleteSecurityImpact(@PathVariable Long id) {
        log.debug("REST request to delete SecurityImpact : {}", id);
        securityImpactService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
