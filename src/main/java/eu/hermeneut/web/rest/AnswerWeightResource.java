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
import eu.hermeneut.domain.AnswerWeight;
import eu.hermeneut.service.AnswerWeightService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing AnswerWeight.
 */
@RestController
@RequestMapping("/api")
public class AnswerWeightResource {

    private final Logger log = LoggerFactory.getLogger(AnswerWeightResource.class);

    private static final String ENTITY_NAME = "answerWeight";

    private final AnswerWeightService answerWeightService;

    public AnswerWeightResource(AnswerWeightService answerWeightService) {
        this.answerWeightService = answerWeightService;
    }

    /**
     * POST  /answer-weights : Create a new answerWeight.
     *
     * @param answerWeight the answerWeight to create
     * @return the ResponseEntity with status 201 (Created) and with body the new answerWeight, or with status 400 (Bad Request) if the answerWeight has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/answer-weights")
    @Timed
    public ResponseEntity<AnswerWeight> createAnswerWeight(@RequestBody AnswerWeight answerWeight) throws URISyntaxException {
        log.debug("REST request to save AnswerWeight : {}", answerWeight);
        if (answerWeight.getId() != null) {
            throw new BadRequestAlertException("A new answerWeight cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AnswerWeight result = answerWeightService.save(answerWeight);
        return ResponseEntity.created(new URI("/api/answer-weights/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /answer-weights : Updates an existing answerWeight.
     *
     * @param answerWeight the answerWeight to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated answerWeight,
     * or with status 400 (Bad Request) if the answerWeight is not valid,
     * or with status 500 (Internal Server Error) if the answerWeight couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/answer-weights")
    @Timed
    public ResponseEntity<AnswerWeight> updateAnswerWeight(@RequestBody AnswerWeight answerWeight) throws URISyntaxException {
        log.debug("REST request to update AnswerWeight : {}", answerWeight);
        if (answerWeight.getId() == null) {
            return createAnswerWeight(answerWeight);
        }
        AnswerWeight result = answerWeightService.save(answerWeight);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, answerWeight.getId().toString()))
            .body(result);
    }

    /**
     * GET  /answer-weights : get all the answerWeights.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of answerWeights in body
     */
    @GetMapping("/answer-weights")
    @Timed
    public List<AnswerWeight> getAllAnswerWeights() {
        log.debug("REST request to get all AnswerWeights");
        return answerWeightService.findAll();
        }

    /**
     * GET  /answer-weights/:id : get the "id" answerWeight.
     *
     * @param id the id of the answerWeight to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the answerWeight, or with status 404 (Not Found)
     */
    @GetMapping("/answer-weights/{id}")
    @Timed
    public ResponseEntity<AnswerWeight> getAnswerWeight(@PathVariable Long id) {
        log.debug("REST request to get AnswerWeight : {}", id);
        AnswerWeight answerWeight = answerWeightService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(answerWeight));
    }

    /**
     * DELETE  /answer-weights/:id : delete the "id" answerWeight.
     *
     * @param id the id of the answerWeight to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/answer-weights/{id}")
    @Timed
    public ResponseEntity<Void> deleteAnswerWeight(@PathVariable Long id) {
        log.debug("REST request to delete AnswerWeight : {}", id);
        answerWeightService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
