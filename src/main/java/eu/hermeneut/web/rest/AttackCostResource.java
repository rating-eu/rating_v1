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
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing AttackCost.
 */
@RestController
@RequestMapping("/api")
public class AttackCostResource {

    private final Logger log = LoggerFactory.getLogger(AttackCostResource.class);

    private static final String ENTITY_NAME = "attackCost";

    private final AttackCostService attackCostService;

    private final SelfAssessmentService selfAssessmentService;

    public AttackCostResource(AttackCostService attackCostService, SelfAssessmentService selfAssessmentService) {
        this.attackCostService = attackCostService;
        this.selfAssessmentService = selfAssessmentService;
    }

    /**
     * POST  /attack-costs : Create a new attackCost.
     *
     * @param attackCost the attackCost to create
     * @return the ResponseEntity with status 201 (Created) and with body the new attackCost, or with status 400 (Bad Request) if the attackCost has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/attack-costs")
    @Timed
    public ResponseEntity<AttackCost> createAttackCost(@Valid @RequestBody AttackCost attackCost) throws URISyntaxException {
        log.debug("REST request to save AttackCost : {}", attackCost);
        if (attackCost.getId() != null) {
            throw new BadRequestAlertException("A new attackCost cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AttackCost result = attackCostService.save(attackCost);
        return ResponseEntity.created(new URI("/api/attack-costs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /attack-costs : Updates an existing attackCost.
     *
     * @param attackCost the attackCost to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated attackCost,
     * or with status 400 (Bad Request) if the attackCost is not valid,
     * or with status 500 (Internal Server Error) if the attackCost couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/attack-costs")
    @Timed
    public ResponseEntity<AttackCost> updateAttackCost(@Valid @RequestBody AttackCost attackCost) throws URISyntaxException {
        log.debug("REST request to update AttackCost : {}", attackCost);
        if (attackCost.getId() == null) {
            return createAttackCost(attackCost);
        }
        AttackCost result = attackCostService.save(attackCost);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, attackCost.getId().toString()))
            .body(result);
    }

    @PutMapping("/{selfAssessmentID}/attack-costs")
    @Timed
    public ResponseEntity<AttackCost> updateAttackCostsBySelfAssessment(@PathVariable Long selfAssessmentID, @NotNull @Valid @RequestBody AttackCost attackCost) throws NotFoundException {
        log.debug("REST request to update all AttackCosts of type : {} for SelfAssessment : {}", attackCost.getType());

        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with ID : " + selfAssessmentID + " NOT FOUND!");
        }

        List<AttackCost> attackCosts = this.attackCostService.findAllBySelfAssessmentAndCostTypeWithDuplicateTypes(selfAssessmentID, attackCost.getType());

        if (attackCosts != null && !attackCosts.isEmpty()) {
            attackCosts.stream().forEach((aCost) -> {
                aCost.setCosts(attackCost.getCosts());
            });

            List<AttackCost> result = this.attackCostService.save(attackCosts);
            AttackCost first = result.get(0);
            first.setId(null);

            return ResponseEntity.ok()
                .body(first);
        } else {
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body(attackCost);
        }
    }

    /**
     * GET  /attack-costs : get all the attackCosts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackCosts in body
     */
    @GetMapping("/attack-costs")
    @Timed
    public List<AttackCost> getAllAttackCosts() {
        log.debug("REST request to get all AttackCosts");
        return attackCostService.findAll();
    }

    @GetMapping("/{selfAssessmentID}/attack-costs")
    @Timed
    public List<AttackCost> getAttackCostsBySelfAssessment(@PathVariable Long selfAssessmentID) {
        log.debug("REST request to get all AttackCosts by SelfAssessment ID");
        return attackCostService.findAllUniqueTypesBySelfAssessmentWithNulledID(selfAssessmentID);
    }

    /**
     * GET  /attack-costs/:id : get the "id" attackCost.
     *
     * @param id the id of the attackCost to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the attackCost, or with status 404 (Not Found)
     */
    @GetMapping("/attack-costs/{id}")
    @Timed
    public ResponseEntity<AttackCost> getAttackCost(@PathVariable Long id) {
        log.debug("REST request to get AttackCost : {}", id);
        AttackCost attackCost = attackCostService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(attackCost));
    }

    /**
     * DELETE  /attack-costs/:id : delete the "id" attackCost.
     *
     * @param id the id of the attackCost to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/attack-costs/{id}")
    @Timed
    public ResponseEntity<Void> deleteAttackCost(@PathVariable Long id) {
        log.debug("REST request to delete AttackCost : {}", id);
        attackCostService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/attack-costs?query=:query : search for the attackCost corresponding
     * to the query.
     *
     * @param query the query of the attackCost search
     * @return the result of the search
     */
    @GetMapping("/_search/attack-costs")
    @Timed
    public List<AttackCost> searchAttackCosts(@RequestParam String query) {
        log.debug("REST request to search AttackCosts for query {}", query);
        return attackCostService.search(query);
    }

}
