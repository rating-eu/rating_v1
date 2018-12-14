package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.QuestionnaireStatus;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.service.QuestionnaireStatusService;
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

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing QuestionnaireStatus.
 */
@RestController
@RequestMapping("/api")
public class QuestionnaireStatusResource {

    private final Logger log = LoggerFactory.getLogger(QuestionnaireStatusResource.class);

    private static final String ENTITY_NAME = "questionnaireStatus";

    private final QuestionnaireStatusService questionnaireStatusService;

    public QuestionnaireStatusResource(QuestionnaireStatusService questionnaireStatusService) {
        this.questionnaireStatusService = questionnaireStatusService;
    }

    /**
     * POST  /questionnaire-statuses : Create a new questionnaireStatus.
     *
     * @param questionnaireStatus the questionnaireStatus to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionnaireStatus, or with status 400 (Bad Request) if the questionnaireStatus has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/questionnaire-statuses")
    @Timed
    public ResponseEntity<QuestionnaireStatus> createQuestionnaireStatus(@Valid @RequestBody QuestionnaireStatus questionnaireStatus) throws URISyntaxException {
        log.debug("REST request to save QuestionnaireStatus : {}", questionnaireStatus);
        if (questionnaireStatus.getId() != null) {
            throw new BadRequestAlertException("A new questionnaireStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }

        //Set the current date for the questionnaire status (created and modified)
        ZonedDateTime now = ZonedDateTime.now();
        questionnaireStatus.setCreated(now);
        questionnaireStatus.setModified(now);

        QuestionnaireStatus result = questionnaireStatusService.save(questionnaireStatus);

        return ResponseEntity.created(new URI("/api/questionnaire-statuses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /questionnaire-statuses : Updates an existing questionnaireStatus.
     *
     * @param questionnaireStatus the questionnaireStatus to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionnaireStatus,
     * or with status 400 (Bad Request) if the questionnaireStatus is not valid,
     * or with status 500 (Internal Server Error) if the questionnaireStatus couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/questionnaire-statuses")
    @Timed
    public ResponseEntity<QuestionnaireStatus> updateQuestionnaireStatus(@Valid @RequestBody QuestionnaireStatus questionnaireStatus) throws URISyntaxException {
        log.debug("REST request to update QuestionnaireStatus : {}", questionnaireStatus);
        if (questionnaireStatus.getId() == null) {
            return createQuestionnaireStatus(questionnaireStatus);
        }

        //Set the current date for the questionnaire status (modified)
        ZonedDateTime now = ZonedDateTime.now();
        questionnaireStatus.setModified(now);

        QuestionnaireStatus result = questionnaireStatusService.save(questionnaireStatus);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionnaireStatus.getId().toString()))
            .body(result);
    }

    /**
     * GET  /questionnaire-statuses : get all the questionnaireStatuses.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionnaireStatuses in body
     */
    @GetMapping("/questionnaire-statuses")
    @Timed
    public List<QuestionnaireStatus> getAllQuestionnaireStatuses() {
        log.debug("REST request to get all QuestionnaireStatuses");
        return questionnaireStatusService.findAll();
    }

    /**
     * GET  /questionnaire-statuses : get all the questionnaireStatuses.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionnaireStatuses in body
     */
    @GetMapping("/questionnaire-statuses/self-assessment/{selfAssessmentID}/user/{userID}")
    @Timed
    public List<QuestionnaireStatus> getAllQuestionnaireStatusesBySelfAssessmentAndUser(@PathVariable Long selfAssessmentID, @PathVariable Long userID) {
        log.debug("REST request to get all QuestionnaireStatuses by self assessment and user");
        return questionnaireStatusService.findAllBySelfAssessmentAndUser(selfAssessmentID, userID);
    }

    /**
     * GET  /questionnaire-statuses : get all the questionnaireStatuses by Role SelfAssessment and Questionnaire.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionnaireStatuses in body
     */
    @GetMapping("/questionnaire-statuses/self-assessment/{selfAssessmentID}/questionnaire/{questionnaireID}/role/{role}")
    @Timed
    public QuestionnaireStatus getQuestionnaireStatusByRoleSelfAssessmentAndQuestionnaire(@PathVariable Long selfAssessmentID, @PathVariable Long questionnaireID, @PathVariable String role) {
        log.debug("REST request to get all QuestionnaireStatuses by Role SelfAssessment and Questionnaire");
        return questionnaireStatusService.findByRoleSelfAssessmentAndQuestionnaire(role, selfAssessmentID, questionnaireID);
    }

    /**
     * GET  /questionnaire-statuses : get all the questionnaireStatuses.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionnaireStatuses in body
     */
    @GetMapping("/questionnaire-statuses/self-assessment/{selfAssessmentID}")
    @Timed
    public List<QuestionnaireStatus> getAllQuestionnaireStatusesBySelfAssessment(@PathVariable Long selfAssessmentID) {
        log.debug("REST request to get all QuestionnaireStatuses by SelfAssessment");
        return questionnaireStatusService.findAllBySelfAssessment(selfAssessmentID);
    }

    /**
     * GET  /questionnaire-statuses/:id : get the "id" questionnaireStatus.
     *
     * @param id the id of the questionnaireStatus to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionnaireStatus, or with status 404 (Not Found)
     */
    @GetMapping("/questionnaire-statuses/{id}")
    @Timed
    public ResponseEntity<QuestionnaireStatus> getQuestionnaireStatus(@PathVariable Long id) {
        log.debug("REST request to get QuestionnaireStatus : {}", id);
        QuestionnaireStatus questionnaireStatus = questionnaireStatusService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionnaireStatus));
    }

    @GetMapping("/questionnaire-statuses/{selfAssessmentID}/{questionnairePurpose}")
    @Timed
    public List<QuestionnaireStatus> getQuestionnaireStatusBySelfAssessmentAndQuestionnairePurpose(@PathVariable Long selfAssessmentID, @PathVariable String questionnairePurpose) {
        log.debug("REST request to get QuestionnaireStatus by selfAssessment and questionnairePurpose");
        log.debug("SelfAssessment: " + selfAssessmentID);
        log.debug("QuestionnairePurpose: " + questionnairePurpose);

        QuestionnairePurpose purpose = QuestionnairePurpose.valueOf(questionnairePurpose);
        log.debug("Purpose enum: " + purpose);

        List<QuestionnaireStatus> questionnaireStatuses = questionnaireStatusService.findAllBySelfAssessmentAndQuestionnairePurpose(selfAssessmentID, purpose);
        return questionnaireStatuses;
    }

    /**
     * DELETE  /questionnaire-statuses/:id : delete the "id" questionnaireStatus.
     *
     * @param id the id of the questionnaireStatus to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/questionnaire-statuses/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionnaireStatus(@PathVariable Long id) {
        log.debug("REST request to delete QuestionnaireStatus : {}", id);
        questionnaireStatusService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/questionnaire-statuses?query=:query : search for the questionnaireStatus corresponding
     * to the query.
     *
     * @param query the query of the questionnaireStatus search
     * @return the result of the search
     */
    @GetMapping("/_search/questionnaire-statuses")
    @Timed
    public List<QuestionnaireStatus> searchQuestionnaireStatuses(@RequestParam String query) {
        log.debug("REST request to search QuestionnaireStatuses for query {}", query);
        return questionnaireStatusService.search(query);
    }

}
