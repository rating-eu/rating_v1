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
import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.Level;
import eu.hermeneut.domain.Phase;
import eu.hermeneut.service.AttackStrategyService;
import eu.hermeneut.service.LevelService;
import eu.hermeneut.service.PhaseService;
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
 * REST controller for managing AttackStrategy.
 */
@RestController
@RequestMapping("/api")
public class AttackStrategyResource {

    private final Logger log = LoggerFactory.getLogger(AttackStrategyResource.class);

    private static final String ENTITY_NAME = "attackStrategy";

    private final AttackStrategyService attackStrategyService;
    private final LevelService levelService;
    private final PhaseService phaseService;


    public AttackStrategyResource(AttackStrategyService attackStrategyService, LevelService levelService, PhaseService phaseService) {
        this.attackStrategyService = attackStrategyService;
        this.levelService = levelService;
        this.phaseService = phaseService;
    }

    /**
     * POST  /attack-strategies : Create a new attackStrategy.
     *
     * @param attackStrategy the attackStrategy to create
     * @return the ResponseEntity with status 201 (Created) and with body the new attackStrategy, or with status 400 (Bad Request) if the attackStrategy has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/attack-strategies")
    @Timed
    public ResponseEntity<AttackStrategy> createAttackStrategy(@Valid @RequestBody AttackStrategy attackStrategy) throws URISyntaxException {
        log.debug("REST request to save AttackStrategy : {}", attackStrategy);
        if (attackStrategy.getId() != null) {
            throw new BadRequestAlertException("A new attackStrategy cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AttackStrategy result = attackStrategyService.save(attackStrategy);
        return ResponseEntity.created(new URI("/api/attack-strategies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /attack-strategies : Updates an existing attackStrategy.
     *
     * @param attackStrategy the attackStrategy to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated attackStrategy,
     * or with status 400 (Bad Request) if the attackStrategy is not valid,
     * or with status 500 (Internal Server Error) if the attackStrategy couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/attack-strategies")
    @Timed
    public ResponseEntity<AttackStrategy> updateAttackStrategy(@Valid @RequestBody AttackStrategy attackStrategy) throws URISyntaxException {
        log.debug("REST request to update AttackStrategy : {}", attackStrategy);
        if (attackStrategy.getId() == null) {
            return createAttackStrategy(attackStrategy);
        }
        AttackStrategy result = attackStrategyService.save(attackStrategy);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, attackStrategy.getId().toString()))
            .body(result);
    }

    /**
     * GET  /attack-strategies : get all the attackStrategies.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackStrategies in body
     */
    @GetMapping("/attack-strategies")
    @Timed
    public List<AttackStrategy> getAllAttackStrategies() {
        log.debug("REST request to get all AttackStrategies");
        return attackStrategyService.findAll();
    }

    /**
     * GET  /attack-strategies/:id : get the "id" attackStrategy.
     *
     * @param id the id of the attackStrategy to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the attackStrategy, or with status 404 (Not Found)
     */
    @GetMapping("/attack-strategies/{id}")
    @Timed
    public ResponseEntity<AttackStrategy> getAttackStrategy(@PathVariable Long id) {
        log.debug("REST request to get AttackStrategy : {}", id);
        AttackStrategy attackStrategy = attackStrategyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(attackStrategy));
    }

    /**
     * DELETE  /attack-strategies/:id : delete the "id" attackStrategy.
     *
     * @param id the id of the attackStrategy to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/attack-strategies/{id}")
    @Timed
    public ResponseEntity<Void> deleteAttackStrategy(@PathVariable Long id) {
        log.debug("REST request to delete AttackStrategy : {}", id);
        attackStrategyService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }


    /**
     * GET  /attack-strategies/level/{level} : get all the attackStrategiesByLevel.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackStrategies in body
     */
    @GetMapping("/attack-strategies/level/{levelID}")
    @Timed
    public List<AttackStrategy> getAllAttackStrategiesByLevel(@PathVariable Long levelID) {
        log.debug("REST request to get all AttackStrategies BY LEVEL");

        List<AttackStrategy> toReturn = new ArrayList<AttackStrategy>();
        try {
            Level level = this.levelService.findOne(levelID);
            toReturn = attackStrategyService.findAllByLevel(level);

        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        }

        return toReturn;
    }

    /**
     * GET  /attack-strategies/phase/{phase} : get all the attackStrategiesByPhase.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackStrategies in body
     */
    @GetMapping("/attack-strategies/phase/{phaseID}")
    @Timed
    public List<AttackStrategy> getAllAttackStrategiesByPhase(@PathVariable Long phaseID) {
        log.debug("REST request to get all AttackStrategies BY Phase");

        List<AttackStrategy> toReturn = new ArrayList<>();
        try {
            Phase phase = this.phaseService.findOne(phaseID);
            toReturn = attackStrategyService.findAllByPhase(phase);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        }

        return toReturn;
    }

    /**
     * GET all the attackStrategies By Container.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackStrategies in body
     */
    @GetMapping("/attack-strategies/container/{containerID}")
    @Timed
    public List<AttackStrategy> getAllAttackStrategiesByContainer(@PathVariable("containerID") Long containerID) {
        log.debug("REST request to get all AttackStrategies by Container: " + containerID);

        return attackStrategyService.findAllByContainer(containerID);
    }

    /**
     * GET  /attack-strategies/l/{level}/p/{phase} : get all the attackStrategiesByLevelAndPhase.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attackStrategies in body
     */
    @GetMapping("/attack-strategies/level/{levelID}/phase/{phaseID}")
    @Timed
    public List<AttackStrategy> attackStrategiesByLevelAndPhase(@PathVariable Long levelID, @PathVariable Long phaseID) {
        log.debug("REST request to get all AttackStrategies BY LEVEL AND Phase");

        List<AttackStrategy> toReturn = new ArrayList<AttackStrategy>();
        try {
            Phase phase = this.phaseService.findOne(phaseID);
            Level level = this.levelService.findOne(levelID);
            toReturn = attackStrategyService.findAllByLevelAndPhase(level, phase);

        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        }

        return toReturn;
    }

    /**
     * SEARCH  /_search/attack-strategies?query=:query : search for the attackStrategy corresponding
     * to the query.
     *
     * @param query the query of the attackStrategy search
     * @return the result of the search
     */
    @GetMapping("/_search/attack-strategies")
    @Timed
    public List<AttackStrategy> searchAttackStrategies(@RequestParam String query) {
        log.debug("REST request to search AttackStrategies for query {}", query);
        return attackStrategyService.search(query);
    }

}
