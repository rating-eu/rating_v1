package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.OverallSecurityImpact;
import eu.hermeneut.service.OverallSecurityImpactService;
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
 * REST controller for managing OverallSecurityImpact.
 */
@RestController
@RequestMapping("/api")
public class OverallSecurityImpactResource {

    private final Logger log = LoggerFactory.getLogger(OverallSecurityImpactResource.class);

    private static final String ENTITY_NAME = "overallSecurityImpact";

    private final OverallSecurityImpactService overallSecurityImpactService;

    public OverallSecurityImpactResource(OverallSecurityImpactService overallSecurityImpactService) {
        this.overallSecurityImpactService = overallSecurityImpactService;
    }

    /**
     * POST  /overall-security-impacts : Create a new overallSecurityImpact.
     *
     * @param overallSecurityImpact the overallSecurityImpact to create
     * @return the ResponseEntity with status 201 (Created) and with body the new overallSecurityImpact, or with status 400 (Bad Request) if the overallSecurityImpact has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/overall-security-impacts")
    @Timed
    public ResponseEntity<OverallSecurityImpact> createOverallSecurityImpact(@Valid @RequestBody OverallSecurityImpact overallSecurityImpact) throws URISyntaxException {
        log.debug("REST request to save OverallSecurityImpact : {}", overallSecurityImpact);
        if (overallSecurityImpact.getId() != null) {
            throw new BadRequestAlertException("A new overallSecurityImpact cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OverallSecurityImpact result = overallSecurityImpactService.save(overallSecurityImpact);
        return ResponseEntity.created(new URI("/api/overall-security-impacts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /overall-security-impacts : Updates an existing overallSecurityImpact.
     *
     * @param overallSecurityImpact the overallSecurityImpact to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated overallSecurityImpact,
     * or with status 400 (Bad Request) if the overallSecurityImpact is not valid,
     * or with status 500 (Internal Server Error) if the overallSecurityImpact couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/overall-security-impacts")
    @Timed
    public ResponseEntity<OverallSecurityImpact> updateOverallSecurityImpact(@Valid @RequestBody OverallSecurityImpact overallSecurityImpact) throws URISyntaxException {
        log.debug("REST request to update OverallSecurityImpact : {}", overallSecurityImpact);
        if (overallSecurityImpact.getId() == null) {
            return createOverallSecurityImpact(overallSecurityImpact);
        }
        OverallSecurityImpact result = overallSecurityImpactService.save(overallSecurityImpact);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, overallSecurityImpact.getId().toString()))
            .body(result);
    }

    /**
     * GET  /overall-security-impacts : get all the overallSecurityImpacts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of overallSecurityImpacts in body
     */
    @GetMapping("/overall-security-impacts")
    @Timed
    public List<OverallSecurityImpact> getAllOverallSecurityImpacts() {
        log.debug("REST request to get all OverallSecurityImpacts");
        return overallSecurityImpactService.findAll();
    }

    /**
     * GET  /overall-security-impacts/:id : get the "id" overallSecurityImpact.
     *
     * @param id the id of the overallSecurityImpact to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the overallSecurityImpact, or with status 404 (Not Found)
     */
    @GetMapping("/overall-security-impacts/{id}")
    @Timed
    public ResponseEntity<OverallSecurityImpact> getOverallSecurityImpact(@PathVariable Long id) {
        log.debug("REST request to get OverallSecurityImpact : {}", id);
        OverallSecurityImpact overallSecurityImpact = overallSecurityImpactService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(overallSecurityImpact));
    }

    @GetMapping("/overall-security-impacts/company-profile/{companyProfileID}")
    @Timed
    public List<OverallSecurityImpact> getOverallSecurityImpactsByCompanyProfile(@PathVariable Long companyProfileID){
        log.debug("REST request to get OverallSecurityImpacts by CompanyProfile : {}", companyProfileID);

        return this.overallSecurityImpactService.findAllByCompanyProfile(companyProfileID);
    }

    /**
     * GET  /overall-security-impacts/operation/:operationID : get the overallSecurityImpact.
     *
     * @param operationID the id of the DataOperation
     * @return the ResponseEntity with status 200 (OK) and with body the overallSecurityImpact, or with status 404 (Not Found)
     */
    @GetMapping("/overall-security-impacts/operation/{operationID}")
    @Timed
    public ResponseEntity<OverallSecurityImpact> getOverallSecurityImpactByDataOperation(@PathVariable Long operationID) {
        log.debug("REST request to get OverallSecurityImpact by DataOperation: {}", operationID);
        OverallSecurityImpact overallSecurityImpact = overallSecurityImpactService.findOneByDataOperation(operationID);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(overallSecurityImpact));
    }

    /**
     * DELETE  /overall-security-impacts/:id : delete the "id" overallSecurityImpact.
     *
     * @param id the id of the overallSecurityImpact to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/overall-security-impacts/{id}")
    @Timed
    public ResponseEntity<Void> deleteOverallSecurityImpact(@PathVariable Long id) {
        log.debug("REST request to delete OverallSecurityImpact : {}", id);
        overallSecurityImpactService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
