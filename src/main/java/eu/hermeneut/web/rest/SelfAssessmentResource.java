package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.*;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.security.SecurityUtils;
import eu.hermeneut.service.*;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing SelfAssessment.
 */
@RestController
@RequestMapping("/api")
public class SelfAssessmentResource {

    private final Logger log = LoggerFactory.getLogger(SelfAssessmentResource.class);

    private static final String ENTITY_NAME = "selfAssessment";

    private final SelfAssessmentService selfAssessmentService;

    private final UserService userService;

    private final ExternalAuditService externalAuditService;

    private final MyCompanyService myCompanyService;

    public SelfAssessmentResource(SelfAssessmentService selfAssessmentService, UserService userService, ExternalAuditService externalAuditService, MyCompanyService myCompanyService) {
        this.selfAssessmentService = selfAssessmentService;
        this.userService = userService;
        this.externalAuditService = externalAuditService;
        this.myCompanyService = myCompanyService;
    }

    /**
     * POST  /self-assessments : Create a new selfAssessment.
     *
     * @param selfAssessment the selfAssessment to create
     * @return the ResponseEntity with status 201 (Created) and with body the new selfAssessment, or with status 400 (Bad Request) if the selfAssessment has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/self-assessments")
    @Timed
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public ResponseEntity<SelfAssessment> createSelfAssessment(@Valid @RequestBody SelfAssessment selfAssessment) throws URISyntaxException {
        log.debug("REST request to save SelfAssessment : {}", selfAssessment);
        if (selfAssessment.getId() != null) {
            throw new BadRequestAlertException("A new selfAssessment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SelfAssessment result = selfAssessmentService.save(selfAssessment);
        return ResponseEntity.created(new URI("/api/self-assessments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /self-assessments : Updates an existing selfAssessment.
     *
     * @param selfAssessment the selfAssessment to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated selfAssessment,
     * or with status 400 (Bad Request) if the selfAssessment is not valid,
     * or with status 500 (Internal Server Error) if the selfAssessment couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/self-assessments")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessment) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public ResponseEntity<SelfAssessment> updateSelfAssessment(@Valid @RequestBody SelfAssessment selfAssessment) throws URISyntaxException {
        log.debug("REST request to update SelfAssessment : {}", selfAssessment);
        if (selfAssessment.getId() == null) {
            return createSelfAssessment(selfAssessment);
        }
        SelfAssessment result = selfAssessmentService.save(selfAssessment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, selfAssessment.getId().toString()))
            .body(result);
    }

    /**
     * GET  /self-assessments : get all the selfAssessments.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of selfAssessments in body
     */
    @GetMapping("/self-assessments")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public List<SelfAssessment> getAllSelfAssessments() {
        log.debug("REST request to get all SelfAssessments");
        return selfAssessmentService.findAll();
    }

    /**
     * GET  /self-assessments/:id : get the "id" selfAssessment.
     *
     * @param id the id of the selfAssessment to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the selfAssessment, or with status 404 (Not Found)
     */
    @GetMapping("/self-assessments/{id}")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#id) || @selfAssessmentGuardian.isExternal(#id) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.EXTERNAL_AUDIT, AuthoritiesConstants.ADMIN})
    public ResponseEntity<SelfAssessment> getSelfAssessment(@PathVariable Long id) {
        log.debug("REST request to get SelfAssessment : {}", id);
        SelfAssessment selfAssessment = selfAssessmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(selfAssessment));
    }

    /**
     * GET  /my-self-assessments: get the SelfAssessments of the current User.
     *
     * @return the SelfAssessments of the current User.
     */
    @GetMapping("/my-self-assessments")
    @Timed
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.EXTERNAL_AUDIT})
    public List<SelfAssessment> getMySelfAssessments() {
        log.debug("REST request to get MySelfAssessments fro logged user.");
        List<SelfAssessment> selfAssessments = new ArrayList<>();

        //Get the current user
        User currentUser = this.userService.getUserWithAuthorities().orElse(null);

        if (currentUser != null) {
            if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.CISO)) {
                //GET the SelfAssessments by SelfAssessment.CompanyProfile == User.MyCompany
                MyCompany myCompany = this.myCompanyService.findOneByUser(currentUser.getId());

                if (myCompany != null) {
                    CompanyProfile companyProfile = myCompany.getCompanyProfile();
                    if (companyProfile != null) {
                        selfAssessments = this.selfAssessmentService.findAllByCompanyProfile(companyProfile.getId());
                    }
                }
            } else if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.EXTERNAL_AUDIT)) {
                //GET the SelfAssessments by SelfAssessment.externalAudit
                ExternalAudit externalAudit = this.externalAuditService.getByUser(currentUser);

                if (externalAudit != null) {
                    selfAssessments = this.selfAssessmentService.findAllByExternalAudit(externalAudit);
                }
            }
        }

        return selfAssessments;
    }

    /**
     * DELETE  /self-assessments/:id : delete the "id" selfAssessment.
     *
     * @param id the id of the selfAssessment to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/self-assessments/{id}")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#id) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteSelfAssessment(@PathVariable Long id) {
        log.debug("REST request to delete SelfAssessment : {}", id);
        selfAssessmentService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/self-assessments?query=:query : search for the selfAssessment corresponding
     * to the query.
     *
     * @param query the query of the selfAssessment search
     * @return the result of the search
     */
    @GetMapping("/_search/self-assessments")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public List<SelfAssessment> searchSelfAssessments(@RequestParam String query) {
        log.debug("REST request to search SelfAssessments for query {}", query);
        return selfAssessmentService.search(query);
    }
}
