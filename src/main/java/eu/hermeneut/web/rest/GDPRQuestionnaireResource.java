package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.GDPRQuestionnaire;
import eu.hermeneut.domain.enumeration.GDPRQuestionnairePurpose;
import eu.hermeneut.service.GDPRQuestionnaireService;
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
 * REST controller for managing GDPRQuestionnaire.
 */
@RestController
@RequestMapping("/api")
public class GDPRQuestionnaireResource {

    private final Logger log = LoggerFactory.getLogger(GDPRQuestionnaireResource.class);

    private static final String ENTITY_NAME = "gDPRQuestionnaire";

    private final GDPRQuestionnaireService gDPRQuestionnaireService;

    public GDPRQuestionnaireResource(GDPRQuestionnaireService gDPRQuestionnaireService) {
        this.gDPRQuestionnaireService = gDPRQuestionnaireService;
    }

    /**
     * POST  /gdpr-questionnaires : Create a new gDPRQuestionnaire.
     *
     * @param gDPRQuestionnaire the gDPRQuestionnaire to create
     * @return the ResponseEntity with status 201 (Created) and with body the new gDPRQuestionnaire, or with status 400 (Bad Request) if the gDPRQuestionnaire has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/gdpr-questionnaires")
    @Timed
    public ResponseEntity<GDPRQuestionnaire> createGDPRQuestionnaire(@Valid @RequestBody GDPRQuestionnaire gDPRQuestionnaire) throws URISyntaxException {
        log.debug("REST request to save GDPRQuestionnaire : {}", gDPRQuestionnaire);
        if (gDPRQuestionnaire.getId() != null) {
            throw new BadRequestAlertException("A new gDPRQuestionnaire cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GDPRQuestionnaire result = gDPRQuestionnaireService.save(gDPRQuestionnaire);
        return ResponseEntity.created(new URI("/api/gdpr-questionnaires/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /gdpr-questionnaires : Updates an existing gDPRQuestionnaire.
     *
     * @param gDPRQuestionnaire the gDPRQuestionnaire to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated gDPRQuestionnaire,
     * or with status 400 (Bad Request) if the gDPRQuestionnaire is not valid,
     * or with status 500 (Internal Server Error) if the gDPRQuestionnaire couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/gdpr-questionnaires")
    @Timed
    public ResponseEntity<GDPRQuestionnaire> updateGDPRQuestionnaire(@Valid @RequestBody GDPRQuestionnaire gDPRQuestionnaire) throws URISyntaxException {
        log.debug("REST request to update GDPRQuestionnaire : {}", gDPRQuestionnaire);
        if (gDPRQuestionnaire.getId() == null) {
            return createGDPRQuestionnaire(gDPRQuestionnaire);
        }
        GDPRQuestionnaire result = gDPRQuestionnaireService.save(gDPRQuestionnaire);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, gDPRQuestionnaire.getId().toString()))
            .body(result);
    }

    /**
     * GET  /gdpr-questionnaires : get all the gDPRQuestionnaires.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of gDPRQuestionnaires in body
     */
    @GetMapping("/gdpr-questionnaires")
    @Timed
    public List<GDPRQuestionnaire> getAllGDPRQuestionnaires() {
        log.debug("REST request to get all GDPRQuestionnaires");
        return gDPRQuestionnaireService.findAll();
    }

    /**
     * GET  /gdpr-questionnaires/:id : get the "id" gDPRQuestionnaire.
     *
     * @param id the id of the gDPRQuestionnaire to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the gDPRQuestionnaire, or with status 404 (Not Found)
     */
    @GetMapping("/gdpr-questionnaires/{id}")
    @Timed
    public ResponseEntity<GDPRQuestionnaire> getGDPRQuestionnaire(@PathVariable Long id) {
        log.debug("REST request to get GDPRQuestionnaire : {}", id);
        GDPRQuestionnaire gDPRQuestionnaire = gDPRQuestionnaireService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(gDPRQuestionnaire));
    }

    /**
     * GET  /gdpr-questionnaires/purpose/:purpose : get the "id" gDPRQuestionnaire.
     *
     * @param purpose the purpose of the Questionnaire
     * @return the ResponseEntity with status 200 (OK) and with body the gDPRQuestionnaire, or with status 404 (Not Found)
     */
    @GetMapping("/gdpr-questionnaires/purpose/{purpose}")
    @Timed
    public ResponseEntity<GDPRQuestionnaire> getGDPRQuestionnaireByPurpose(@PathVariable GDPRQuestionnairePurpose purpose) {
        log.debug("REST request to get GDPRQuestionnaire by purpose: {}", purpose);
        GDPRQuestionnaire questionnaire = this.gDPRQuestionnaireService.findOneByPurpose(purpose);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionnaire));
    }

    /**
     * DELETE  /gdpr-questionnaires/:id : delete the "id" gDPRQuestionnaire.
     *
     * @param id the id of the gDPRQuestionnaire to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/gdpr-questionnaires/{id}")
    @Timed
    public ResponseEntity<Void> deleteGDPRQuestionnaire(@PathVariable Long id) {
        log.debug("REST request to delete GDPRQuestionnaire : {}", id);
        gDPRQuestionnaireService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
