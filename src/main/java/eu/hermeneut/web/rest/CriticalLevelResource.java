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
import eu.hermeneut.domain.CriticalLevel;
import eu.hermeneut.service.CriticalLevelService;
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
 * REST controller for managing CriticalLevel.
 */
@RestController
@RequestMapping("/api")
public class CriticalLevelResource {

    private final Logger log = LoggerFactory.getLogger(CriticalLevelResource.class);

    private static final String ENTITY_NAME = "criticalLevel";

    private final CriticalLevelService criticalLevelService;

    public CriticalLevelResource(CriticalLevelService criticalLevelService) {
        this.criticalLevelService = criticalLevelService;
    }

    /**
     * POST  /critical-levels : Create a new criticalLevel.
     *
     * @param criticalLevel the criticalLevel to create
     * @return the ResponseEntity with status 201 (Created) and with body the new criticalLevel, or with status 400 (Bad Request) if the criticalLevel has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/critical-levels")
    @Timed
    public ResponseEntity<CriticalLevel> createCriticalLevel(@Valid @RequestBody CriticalLevel criticalLevel) throws URISyntaxException {
        log.debug("REST request to save CriticalLevel : {}", criticalLevel);
        if (criticalLevel.getId() != null) {
            throw new BadRequestAlertException("A new criticalLevel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CriticalLevel result = criticalLevelService.save(criticalLevel);
        return ResponseEntity.created(new URI("/api/critical-levels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /critical-levels : Updates an existing criticalLevel.
     *
     * @param criticalLevel the criticalLevel to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated criticalLevel,
     * or with status 400 (Bad Request) if the criticalLevel is not valid,
     * or with status 500 (Internal Server Error) if the criticalLevel couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/critical-levels")
    @Timed
    public ResponseEntity<CriticalLevel> updateCriticalLevel(@Valid @RequestBody CriticalLevel criticalLevel) throws URISyntaxException {
        log.debug("REST request to update CriticalLevel : {}", criticalLevel);
        if (criticalLevel.getId() == null) {
            return createCriticalLevel(criticalLevel);
        }
        CriticalLevel result = criticalLevelService.save(criticalLevel);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, criticalLevel.getId().toString()))
            .body(result);
    }

    /**
     * GET  /critical-levels : get all the criticalLevels.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of criticalLevels in body
     */
    @GetMapping("/critical-levels")
    @Timed
    public List<CriticalLevel> getAllCriticalLevels() {
        log.debug("REST request to get all CriticalLevels");
        return criticalLevelService.findAll();
        }

    /**
     * GET  /critical-levels/:id : get the "id" criticalLevel.
     *
     * @param id the id of the criticalLevel to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the criticalLevel, or with status 404 (Not Found)
     */
    @GetMapping("/critical-levels/{id}")
    @Timed
    public ResponseEntity<CriticalLevel> getCriticalLevel(@PathVariable Long id) {
        log.debug("REST request to get CriticalLevel : {}", id);
        CriticalLevel criticalLevel = criticalLevelService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(criticalLevel));
    }

    @GetMapping("/critical-levels/self-assessment/{selfAssessmentID}")
    @Timed
    public ResponseEntity<CriticalLevel> getCriticalLevelBySelfAssessment(@PathVariable Long selfAssessmentID){
        log.debug("REST request to get CriticalLevel by SelfAssessment ID: {}", selfAssessmentID);
        CriticalLevel criticalLevel = criticalLevelService.findOneBySelfAssessment(selfAssessmentID);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(criticalLevel));
    }

    /**
     * DELETE  /critical-levels/:id : delete the "id" criticalLevel.
     *
     * @param id the id of the criticalLevel to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/critical-levels/{id}")
    @Timed
    public ResponseEntity<Void> deleteCriticalLevel(@PathVariable Long id) {
        log.debug("REST request to delete CriticalLevel : {}", id);
        criticalLevelService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/critical-levels?query=:query : search for the criticalLevel corresponding
     * to the query.
     *
     * @param query the query of the criticalLevel search
     * @return the result of the search
     */
    @GetMapping("/_search/critical-levels")
    @Timed
    public List<CriticalLevel> searchCriticalLevels(@RequestParam String query) {
        log.debug("REST request to search CriticalLevels for query {}", query);
        return criticalLevelService.search(query);
    }

}
