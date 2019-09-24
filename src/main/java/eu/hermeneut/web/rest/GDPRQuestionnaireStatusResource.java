package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.GDPRQuestionnaireStatus;
import eu.hermeneut.service.GDPRQuestionnaireStatusService;
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
 * REST controller for managing GDPRQuestionnaireStatus.
 */
@RestController
@RequestMapping("/api")
public class GDPRQuestionnaireStatusResource {

    private final Logger log = LoggerFactory.getLogger(GDPRQuestionnaireStatusResource.class);

    private static final String ENTITY_NAME = "gDPRQuestionnaireStatus";

    private final GDPRQuestionnaireStatusService gDPRQuestionnaireStatusService;

    public GDPRQuestionnaireStatusResource(GDPRQuestionnaireStatusService gDPRQuestionnaireStatusService) {
        this.gDPRQuestionnaireStatusService = gDPRQuestionnaireStatusService;
    }

    /**
     * POST  /gdpr-questionnaire-statuses : Create a new gDPRQuestionnaireStatus.
     *
     * @param gDPRQuestionnaireStatus the gDPRQuestionnaireStatus to create
     * @return the ResponseEntity with status 201 (Created) and with body the new gDPRQuestionnaireStatus, or with status 400 (Bad Request) if the gDPRQuestionnaireStatus has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/gdpr-questionnaire-statuses")
    @Timed
    public ResponseEntity<GDPRQuestionnaireStatus> createGDPRQuestionnaireStatus(@Valid @RequestBody GDPRQuestionnaireStatus gDPRQuestionnaireStatus) throws URISyntaxException {
        log.debug("REST request to save GDPRQuestionnaireStatus : {}", gDPRQuestionnaireStatus);
        if (gDPRQuestionnaireStatus.getId() != null) {
            throw new BadRequestAlertException("A new gDPRQuestionnaireStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GDPRQuestionnaireStatus result = gDPRQuestionnaireStatusService.save(gDPRQuestionnaireStatus);
        return ResponseEntity.created(new URI("/api/gdpr-questionnaire-statuses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /gdpr-questionnaire-statuses : Updates an existing gDPRQuestionnaireStatus.
     *
     * @param gDPRQuestionnaireStatus the gDPRQuestionnaireStatus to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated gDPRQuestionnaireStatus,
     * or with status 400 (Bad Request) if the gDPRQuestionnaireStatus is not valid,
     * or with status 500 (Internal Server Error) if the gDPRQuestionnaireStatus couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/gdpr-questionnaire-statuses")
    @Timed
    public ResponseEntity<GDPRQuestionnaireStatus> updateGDPRQuestionnaireStatus(@Valid @RequestBody GDPRQuestionnaireStatus gDPRQuestionnaireStatus) throws URISyntaxException {
        log.debug("REST request to update GDPRQuestionnaireStatus : {}", gDPRQuestionnaireStatus);
        if (gDPRQuestionnaireStatus.getId() == null) {
            return createGDPRQuestionnaireStatus(gDPRQuestionnaireStatus);
        }
        GDPRQuestionnaireStatus result = gDPRQuestionnaireStatusService.save(gDPRQuestionnaireStatus);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, gDPRQuestionnaireStatus.getId().toString()))
            .body(result);
    }

    /**
     * GET  /gdpr-questionnaire-statuses : get all the gDPRQuestionnaireStatuses.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of gDPRQuestionnaireStatuses in body
     */
    @GetMapping("/gdpr-questionnaire-statuses")
    @Timed
    public List<GDPRQuestionnaireStatus> getAllGDPRQuestionnaireStatuses() {
        log.debug("REST request to get all GDPRQuestionnaireStatuses");
        return gDPRQuestionnaireStatusService.findAll();
        }

    /**
     * GET  /gdpr-questionnaire-statuses/:id : get the "id" gDPRQuestionnaireStatus.
     *
     * @param id the id of the gDPRQuestionnaireStatus to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the gDPRQuestionnaireStatus, or with status 404 (Not Found)
     */
    @GetMapping("/gdpr-questionnaire-statuses/{id}")
    @Timed
    public ResponseEntity<GDPRQuestionnaireStatus> getGDPRQuestionnaireStatus(@PathVariable Long id) {
        log.debug("REST request to get GDPRQuestionnaireStatus : {}", id);
        GDPRQuestionnaireStatus gDPRQuestionnaireStatus = gDPRQuestionnaireStatusService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(gDPRQuestionnaireStatus));
    }

    /**
     * DELETE  /gdpr-questionnaire-statuses/:id : delete the "id" gDPRQuestionnaireStatus.
     *
     * @param id the id of the gDPRQuestionnaireStatus to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/gdpr-questionnaire-statuses/{id}")
    @Timed
    public ResponseEntity<Void> deleteGDPRQuestionnaireStatus(@PathVariable Long id) {
        log.debug("REST request to delete GDPRQuestionnaireStatus : {}", id);
        gDPRQuestionnaireStatusService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
