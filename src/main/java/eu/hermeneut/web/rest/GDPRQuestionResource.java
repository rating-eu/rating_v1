package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.GDPRQuestion;
import eu.hermeneut.service.GDPRQuestionService;
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
 * REST controller for managing GDPRQuestion.
 */
@RestController
@RequestMapping("/api")
public class GDPRQuestionResource {

    private final Logger log = LoggerFactory.getLogger(GDPRQuestionResource.class);

    private static final String ENTITY_NAME = "gDPRQuestion";

    private final GDPRQuestionService gDPRQuestionService;

    public GDPRQuestionResource(GDPRQuestionService gDPRQuestionService) {
        this.gDPRQuestionService = gDPRQuestionService;
    }

    /**
     * POST  /gdpr-questions : Create a new gDPRQuestion.
     *
     * @param gDPRQuestion the gDPRQuestion to create
     * @return the ResponseEntity with status 201 (Created) and with body the new gDPRQuestion, or with status 400 (Bad Request) if the gDPRQuestion has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/gdpr-questions")
    @Timed
    public ResponseEntity<GDPRQuestion> createGDPRQuestion(@Valid @RequestBody GDPRQuestion gDPRQuestion) throws URISyntaxException {
        log.debug("REST request to save GDPRQuestion : {}", gDPRQuestion);
        if (gDPRQuestion.getId() != null) {
            throw new BadRequestAlertException("A new gDPRQuestion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GDPRQuestion result = gDPRQuestionService.save(gDPRQuestion);
        return ResponseEntity.created(new URI("/api/gdpr-questions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /gdpr-questions : Updates an existing gDPRQuestion.
     *
     * @param gDPRQuestion the gDPRQuestion to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated gDPRQuestion,
     * or with status 400 (Bad Request) if the gDPRQuestion is not valid,
     * or with status 500 (Internal Server Error) if the gDPRQuestion couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/gdpr-questions")
    @Timed
    public ResponseEntity<GDPRQuestion> updateGDPRQuestion(@Valid @RequestBody GDPRQuestion gDPRQuestion) throws URISyntaxException {
        log.debug("REST request to update GDPRQuestion : {}", gDPRQuestion);
        if (gDPRQuestion.getId() == null) {
            return createGDPRQuestion(gDPRQuestion);
        }
        GDPRQuestion result = gDPRQuestionService.save(gDPRQuestion);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, gDPRQuestion.getId().toString()))
            .body(result);
    }

    /**
     * GET  /gdpr-questions : get all the gDPRQuestions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of gDPRQuestions in body
     */
    @GetMapping("/gdpr-questions")
    @Timed
    public List<GDPRQuestion> getAllGDPRQuestions() {
        log.debug("REST request to get all GDPRQuestions");
        return gDPRQuestionService.findAll();
        }

    /**
     * GET  /gdpr-questions/:id : get the "id" gDPRQuestion.
     *
     * @param id the id of the gDPRQuestion to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the gDPRQuestion, or with status 404 (Not Found)
     */
    @GetMapping("/gdpr-questions/{id}")
    @Timed
    public ResponseEntity<GDPRQuestion> getGDPRQuestion(@PathVariable Long id) {
        log.debug("REST request to get GDPRQuestion : {}", id);
        GDPRQuestion gDPRQuestion = gDPRQuestionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(gDPRQuestion));
    }

    /**
     * DELETE  /gdpr-questions/:id : delete the "id" gDPRQuestion.
     *
     * @param id the id of the gDPRQuestion to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/gdpr-questions/{id}")
    @Timed
    public ResponseEntity<Void> deleteGDPRQuestion(@PathVariable Long id) {
        log.debug("REST request to delete GDPRQuestion : {}", id);
        gDPRQuestionService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
