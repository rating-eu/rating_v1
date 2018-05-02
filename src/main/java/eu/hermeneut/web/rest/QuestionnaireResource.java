package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.Questionnaire;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.service.QuestionnaireService;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Questionnaire.
 */
@RestController
@RequestMapping("/api")
public class QuestionnaireResource {

    private final Logger log = LoggerFactory.getLogger(QuestionnaireResource.class);

    private static final String ENTITY_NAME = "questionnaire";

    private final QuestionnaireService questionnaireService;

    public QuestionnaireResource(QuestionnaireService questionnaireService) {
        this.questionnaireService = questionnaireService;
    }

    /**
     * POST  /questionnaires : Create a new questionnaire.
     *
     * @param questionnaire the questionnaire to create
     * @return the ResponseEntity with status 201 (Created) and with body the new questionnaire, or with status 400 (Bad Request) if the questionnaire has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/questionnaires")
    @Timed
    public ResponseEntity<Questionnaire> createQuestionnaire(@Valid @RequestBody Questionnaire questionnaire) throws URISyntaxException {
        log.debug("REST request to save Questionnaire : {}", questionnaire);
        if (questionnaire.getId() != null) {
            throw new BadRequestAlertException("A new questionnaire cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Questionnaire result = questionnaireService.save(questionnaire);
        return ResponseEntity.created(new URI("/api/questionnaires/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /questionnaires : Updates an existing questionnaire.
     *
     * @param questionnaire the questionnaire to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated questionnaire,
     * or with status 400 (Bad Request) if the questionnaire is not valid,
     * or with status 500 (Internal Server Error) if the questionnaire couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/questionnaires")
    @Timed
    public ResponseEntity<Questionnaire> updateQuestionnaire(@Valid @RequestBody Questionnaire questionnaire) throws URISyntaxException {
        log.debug("REST request to update Questionnaire : {}", questionnaire);
        if (questionnaire.getId() == null) {
            return createQuestionnaire(questionnaire);
        }
        Questionnaire result = questionnaireService.save(questionnaire);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, questionnaire.getId().toString()))
            .body(result);
    }
    /**
     * GET  /questionnaires/{scope} : get all the questionnaires.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of questionnaires in body
     */
    @GetMapping("/questionnaires/by/purpose/{purpose}")
    @Timed
    public List<Questionnaire> getAllQuestionnairesByPurpose(@PathVariable String purpose) {
        log.debug("REST request to get all Questionnaires by scope");

        List<Questionnaire> questionnaires = new ArrayList<>();
        try {
            QuestionnairePurpose questionnairePurpose = QuestionnairePurpose.valueOf(purpose);
            questionnaires = this.questionnaireService.findAllByPurpose(questionnairePurpose);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        }

        return questionnaires;
    }

    /**
     * GET  /questionnaires : get all the questionnaires.
     *
     * @param filter the filter of the request
     * @return the ResponseEntity with status 200 (OK) and the list of questionnaires in body
     */
    @GetMapping("/questionnaires")
    @Timed
    public List<Questionnaire> getAllQuestionnaires(@RequestParam(required = false) String filter) {
        if ("myanswer-is-null".equals(filter)) {
            log.debug("REST request to get all Questionnaires where myanswer is null");
            return questionnaireService.findAllWhereMyanswerIsNull();
        }
        log.debug("REST request to get all Questionnaires");
        return questionnaireService.findAll();
        }

    /**
     * GET  /questionnaires/:id : get the "id" questionnaire.
     *
     * @param id the id of the questionnaire to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the questionnaire, or with status 404 (Not Found)
     */
    @GetMapping("/questionnaires/{id}")
    @Timed
    public ResponseEntity<Questionnaire> getQuestionnaire(@PathVariable Long id) {
        log.debug("REST request to get Questionnaire : {}", id);
        Questionnaire questionnaire = questionnaireService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(questionnaire));
    }

    /**
     * DELETE  /questionnaires/:id : delete the "id" questionnaire.
     *
     * @param id the id of the questionnaire to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/questionnaires/{id}")
    @Timed
    public ResponseEntity<Void> deleteQuestionnaire(@PathVariable Long id) {
        log.debug("REST request to delete Questionnaire : {}", id);
        questionnaireService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/questionnaires?query=:query : search for the questionnaire corresponding
     * to the query.
     *
     * @param query the query of the questionnaire search
     * @return the result of the search
     */
    @GetMapping("/_search/questionnaires")
    @Timed
    public List<Questionnaire> searchQuestionnaires(@RequestParam String query) {
        log.debug("REST request to search Questionnaires for query {}", query);
        return questionnaireService.search(query);
    }

}
