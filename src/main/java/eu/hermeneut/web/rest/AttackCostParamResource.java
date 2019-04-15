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
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.AttackCostParamService;
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
 * REST controller for managing AttackCostParam.
 */
@RestController
@RequestMapping("/api")
public class AttackCostParamResource {

    private final Logger log = LoggerFactory.getLogger(AttackCostParamResource.class);

    private static final String ENTITY_NAME = "attackCostParam";

    private final AttackCostParamService attackCostParamService;

    public AttackCostParamResource(AttackCostParamService attackCostParamService) {
        this.attackCostParamService = attackCostParamService;
    }

    /**
     * POST  /attack-cost-params : Create a new attackCostParam.
     *
     * @param attackCostParam the attackCostParam to create
     * @return the ResponseEntity with status 201 (Created) and with body the new attackCostParam, or with status 400 (Bad Request) if the attackCostParam has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/attack-cost-params")
    @Timed
    public ResponseEntity<AttackCostParam> createAttackCostParam(@Valid @RequestBody AttackCostParam attackCostParam) throws URISyntaxException {
        log.debug("REST request to save AttackCostParam : {}", attackCostParam);
        if (attackCostParam.getId() != null) {
            throw new BadRequestAlertException("A new attackCostParam cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AttackCostParam result = attackCostParamService.save(attackCostParam);
        return ResponseEntity.created(new URI("/api/attack-cost-params/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /attack-cost-params : Updates an existing attackCostParam.
     *
     * @param attackCostParam the attackCostParam to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated attackCostParam,
     * or with status 400 (Bad Request) if the attackCostParam is not valid,
     * or with status 500 (Internal Server Error) if the attackCostParam couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/attack-cost-params")
    @Timed
    public ResponseEntity<AttackCostParam> updateAttackCostParam(@Valid @RequestBody AttackCostParam attackCostParam) throws URISyntaxException {
        log.debug("REST request to update AttackCostParam : {}", attackCostParam);
        if (attackCostParam.getId() == null) {
            return createAttackCostParam(attackCostParam);
        }
        AttackCostParam result = attackCostParamService.save(attackCostParam);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, attackCostParam.getId().toString()))
            .body(result);
    }

    /**
     * GET  /attack-cost-params : get all the attackCostParams.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackCostParams in body
     */
    @GetMapping("/attack-cost-params")
    @Timed
    public List<AttackCostParam> getAllAttackCostParams() {
        log.debug("REST request to get all AttackCostParams");
        return attackCostParamService.findAll();
    }

    /**
     * GET  /attack-cost-params : get all the attackCostParams.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackCostParams in body
     */
    @GetMapping("/{selfAssessmentID}/attack-cost-params")
    @Timed
    public List<AttackCostParam> getAllAttackCostParamsBySelfAssessment(@PathVariable Long selfAssessmentID) throws NotFoundException {
        log.debug("REST request to get all AttackCostParams by SelfAsssessmentID");
        return attackCostParamService.findAllBySelfAssessment(selfAssessmentID);
    }

    /**
     * GET  /attack-cost-params/:id : get the "id" attackCostParam.
     *
     * @param id the id of the attackCostParam to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the attackCostParam, or with status 404 (Not Found)
     */
    @GetMapping("/attack-cost-params/{id}")
    @Timed
    public ResponseEntity<AttackCostParam> getAttackCostParam(@PathVariable Long id) {
        log.debug("REST request to get AttackCostParam : {}", id);
        AttackCostParam attackCostParam = attackCostParamService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(attackCostParam));
    }

    /**
     * DELETE  /attack-cost-params/:id : delete the "id" attackCostParam.
     *
     * @param id the id of the attackCostParam to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/attack-cost-params/{id}")
    @Timed
    public ResponseEntity<Void> deleteAttackCostParam(@PathVariable Long id) {
        log.debug("REST request to delete AttackCostParam : {}", id);
        attackCostParamService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/attack-cost-params?query=:query : search for the attackCostParam corresponding
     * to the query.
     *
     * @param query the query of the attackCostParam search
     * @return the result of the search
     */
    @GetMapping("/_search/attack-cost-params")
    @Timed
    public List<AttackCostParam> searchAttackCostParams(@RequestParam String query) {
        log.debug("REST request to search AttackCostParams for query {}", query);
        return attackCostParamService.search(query);
    }

}
