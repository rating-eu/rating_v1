package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.QuestionRelevance;
import eu.hermeneut.service.QuestionRelevanceService;
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
 * REST controller for managing QuestionRelevance.
 */
@RestController
@RequestMapping("/api")
public class QuestionRelevanceResource {

    private final Logger log = LoggerFactory.getLogger(QuestionRelevanceResource.class);

    private static final String ENTITY_NAME = "questionRelevance";

    private final QuestionRelevanceService questionRelevanceService;

    public QuestionRelevanceResource(QuestionRelevanceService questionRelevanceService) {
        this.questionRelevanceService = questionRelevanceService;
    }

    /**
     * POST  /question-relevances : Create a new questionRelevance.
     *
     * @param questionRelevance the questionRelevance to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionRelevance, or with status 400 (Bad Request) if the questionRelevance has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/question-relevances")
    @Timed
    public ResponseEntity<QuestionRelevance> createQuestionRelevance(@Valid @RequestBody QuestionRelevance questionRelevance) throws URISyntaxException {
        log.debug("REST request to save QuestionRelevance : {}", questionRelevance);
        if (questionRelevance.getId() != null) {
            throw new BadRequestAlertException("A new questionRelevance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuestionRelevance result = questionRelevanceService.save(questionRelevance);
        return ResponseEntity.created(new URI("/api/question-relevances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-relevances : Updates an existing questionRelevance.
     *
     * @param questionRelevance the questionRelevance to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionRelevance,
     * or with status 400 (Bad Request) if the questionRelevance is not valid,
     * or with status 500 (Internal Server Error) if the questionRelevance couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-relevances")
    @Timed
    public ResponseEntity<QuestionRelevance> updateQuestionRelevance(@Valid @RequestBody QuestionRelevance questionRelevance) throws URISyntaxException {
        log.debug("REST request to update QuestionRelevance : {}", questionRelevance);
        if (questionRelevance.getId() == null) {
            return createQuestionRelevance(questionRelevance);
        }
        QuestionRelevance result = questionRelevanceService.save(questionRelevance);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionRelevance.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /question-relevances/all : Updates existing questionRelevances.
     *
     * @param questionRelevances the questionRelevancea to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionRelevance,
     * or with status 400 (Bad Request) if the questionRelevance is not valid,
     * or with status 500 (Internal Server Error) if the questionRelevance couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/question-relevances/all")
    @Timed
    public List<QuestionRelevance> updateAllQuestionRelevance(@Valid @RequestBody List<QuestionRelevance> questionRelevances) throws URISyntaxException {
        log.debug("REST request to update QuestionRelevances: {}");

        return this.questionRelevanceService.save(questionRelevances);
    }

    /**
     * GET  /question-relevances : get all the questionRelevances.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionRelevances in body
     */
    @GetMapping("/question-relevances")
    @Timed
    public List<QuestionRelevance> getAllQuestionRelevances() {
        log.debug("REST request to get all QuestionRelevances");
        return questionRelevanceService.findAll();
    }

    /**
     * GET  /question-relevances/questionnaire-status/:id : get all the questionRelevances.
     *
     * @param id The ID of the QuestionnaireStatus
     * @return the ResponseEntity with status 200 (OK) and the list of questionRelevances in body
     */
    @GetMapping("/question-relevances/questionnaire-status/{id}")
    @Timed
    public List<QuestionRelevance> getAllQuestionRelevancesByQuestionnaireStatus(@PathVariable Long id) {
        log.debug("REST request to get all QuestionRelevances");
        return questionRelevanceService.findAllByQuestionnaireStatus(id);
    }

    /**
     * GET  /question-relevances/:id : get the "id" questionRelevance.
     *
     * @param id the id of the questionRelevance to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionRelevance, or with status 404 (Not Found)
     */
    @GetMapping("/question-relevances/{id}")
    @Timed
    public ResponseEntity<QuestionRelevance> getQuestionRelevance(@PathVariable Long id) {
        log.debug("REST request to get QuestionRelevance : {}", id);
        QuestionRelevance questionRelevance = questionRelevanceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionRelevance));
    }

    /**
     * DELETE  /question-relevances/:id : delete the "id" questionRelevance.
     *
     * @param id the id of the questionRelevance to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/question-relevances/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionRelevance(@PathVariable Long id) {
        log.debug("REST request to delete QuestionRelevance : {}", id);
        questionRelevanceService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
