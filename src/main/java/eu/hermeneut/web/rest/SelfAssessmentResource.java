package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.service.SelfAssessmentService;
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
 * REST controller for managing SelfAssessment.
 */
@RestController
@RequestMapping("/api")
public class SelfAssessmentResource {

    private final Logger log = LoggerFactory.getLogger(SelfAssessmentResource.class);

    private static final String ENTITY_NAME = "selfAssessment";

    private final SelfAssessmentService selfAssessmentService;

    public SelfAssessmentResource(SelfAssessmentService selfAssessmentService) {
        this.selfAssessmentService = selfAssessmentService;
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
    public ResponseEntity<SelfAssessment> getSelfAssessment(@PathVariable Long id) {
        log.debug("REST request to get SelfAssessment : {}", id);
        SelfAssessment selfAssessment = selfAssessmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(selfAssessment));
    }

    /**
     * DELETE  /self-assessments/:id : delete the "id" selfAssessment.
     *
     * @param id the id of the selfAssessment to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/self-assessments/{id}")
    @Timed
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
    public List<SelfAssessment> searchSelfAssessments(@RequestParam String query) {
        log.debug("REST request to search SelfAssessments for query {}", query);
        return selfAssessmentService.search(query);
    }

}
