/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package eu.hermeneut.web.rest;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.aop.annotation.KafkaRiskProfileHook;
import eu.hermeneut.domain.MyAnswer;
import eu.hermeneut.service.MyAnswerService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing MyAnswer.
 */
@RestController
@RequestMapping("/api")
public class MyAnswerResource {

    private final Logger log = LoggerFactory.getLogger(MyAnswerResource.class);

    private static final String ENTITY_NAME = "myAnswer";

    private final MyAnswerService myAnswerService;

    public MyAnswerResource(MyAnswerService myAnswerService) {
        this.myAnswerService = myAnswerService;
    }

    /**
     * POST  /my-answers : Create a new myAnswer.
     *
     * @param myAnswer the myAnswer to create
     * @return the ResponseEntity with status 201 (Created) and with body the new myAnswer, or with status 400 (Bad Request) if the myAnswer has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/my-answers")
    @Timed
    public ResponseEntity<MyAnswer> createMyAnswer(@RequestBody MyAnswer myAnswer) throws URISyntaxException {
        log.debug("REST request to save MyAnswer : {}", myAnswer);
        if (myAnswer.getId() != null) {
            throw new BadRequestAlertException("A new myAnswer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MyAnswer result = myAnswerService.save(myAnswer);
        return ResponseEntity.created(new URI("/api/my-answers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/{selfAssessmentID}/my-answers/all")
    @Timed
    @KafkaRiskProfileHook
    public List<MyAnswer> createMyAnswers(@PathVariable Long selfAssessmentID, @RequestBody List<MyAnswer> myAnswers) {
        log.debug("REST request to save MyAnswers : {}", myAnswers);

        if (myAnswers.stream().filter(myAnswer -> myAnswer.getId() != null).count() > 0) {
            throw new BadRequestAlertException("A new myAnswer cannot already have an ID", ENTITY_NAME, "idexists");
        }

        List<MyAnswer> result = this.myAnswerService.saveAll(myAnswers);
        return result;
    }

    /**
     * PUT  /my-answers : Updates an existing myAnswer.
     *
     * @param myAnswer the myAnswer to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated myAnswer,
     * or with status 400 (Bad Request) if the myAnswer is not valid,
     * or with status 500 (Internal Server Error) if the myAnswer couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/my-answers")
    @Timed
    public ResponseEntity<MyAnswer> updateMyAnswer(@RequestBody MyAnswer myAnswer) throws URISyntaxException {
        log.debug("REST request to update MyAnswer : {}", myAnswer);
        if (myAnswer.getId() == null) {
            return createMyAnswer(myAnswer);
        }
        MyAnswer result = myAnswerService.save(myAnswer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, myAnswer.getId().toString()))
            .body(result);
    }

    /**
     * GET  /my-answers : get all the myAnswers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of myAnswers in body
     */
    @GetMapping("/my-answers")
    @Timed
    public List<MyAnswer> getAllMyAnswers() {
        log.debug("REST request to get all MyAnswers");
        return myAnswerService.findAll();
    }

    /**
     * GET  /my-answers : get all the myAnswers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of myAnswers in body
     */
    @GetMapping("/my-answers/questionnaire/{questionnaireID}/user/{userID}")
    @Timed
    public List<MyAnswer> getAllMyAnswers(@PathVariable Long questionnaireID, @PathVariable Long userID) {
        log.debug("REST request to get all MyAnswers by questionnaire and user");
        return myAnswerService.findAllByQuestionnaireAndUser(questionnaireID, userID);
    }

    /**
     * GET  /my-answers : get all the myAnswers y QuestionnaireStatus.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of myAnswers in body
     */
    @GetMapping("/my-answers/questionnaire-status/{questionnaireStatusID}")
    @Timed
    public List<MyAnswer> getAllMyAnswers(@PathVariable Long questionnaireStatusID) {
        log.debug("REST request to get all MyAnswers by questionnaire and user");
        return myAnswerService.findAllByQuestionnaireStatus(questionnaireStatusID);
    }


    /**
     * GET  /my-answers/:id : get the "id" myAnswer.
     *
     * @param id the id of the myAnswer to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the myAnswer, or with status 404 (Not Found)
     */
    @GetMapping("/my-answers/{id}")
    @Timed
    public ResponseEntity<MyAnswer> getMyAnswer(@PathVariable Long id) {
        log.debug("REST request to get MyAnswer : {}", id);
        MyAnswer myAnswer = myAnswerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(myAnswer));
    }

    /**
     * DELETE  /my-answers/:id : delete the "id" myAnswer.
     *
     * @param id the id of the myAnswer to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/my-answers/{id}")
    @Timed
    public ResponseEntity<Void> deleteMyAnswer(@PathVariable Long id) {
        log.debug("REST request to delete MyAnswer : {}", id);
        myAnswerService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/my-answers?query=:query : search for the myAnswer corresponding
     * to the query.
     *
     * @param query the query of the myAnswer search
     * @return the result of the search
     */
    @GetMapping("/_search/my-answers")
    @Timed
    public List<MyAnswer> searchMyAnswers(@RequestParam String query) {
        log.debug("REST request to search MyAnswers for query {}", query);
        return myAnswerService.search(query);
    }

}
