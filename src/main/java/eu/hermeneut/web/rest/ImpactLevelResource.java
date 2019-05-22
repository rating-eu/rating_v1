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
import eu.hermeneut.aop.annotation.UpdateImpactsHook;
import eu.hermeneut.domain.ImpactLevel;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.service.ImpactLevelService;
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
 * REST controller for managing ImpactLevel.
 */
@RestController
@RequestMapping("/api")
public class ImpactLevelResource {

    private final Logger log = LoggerFactory.getLogger(ImpactLevelResource.class);

    private static final String ENTITY_NAME = "impactLevel";

    private final ImpactLevelService impactLevelService;

    public ImpactLevelResource(ImpactLevelService impactLevelService) {
        this.impactLevelService = impactLevelService;
    }

    /**
     * POST  /impact-levels : Create a new impactLevel.
     *
     * @param impactLevel the impactLevel to create
     * @return the ResponseEntity with status 201 (Created) and with body the new impactLevel, or with status 400 (Bad Request) if the impactLevel has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/impact-levels")
    @Timed
    public ResponseEntity<ImpactLevel> createImpactLevel(@Valid @RequestBody ImpactLevel impactLevel) throws URISyntaxException {
        log.debug("REST request to save ImpactLevel : {}", impactLevel);
        if (impactLevel.getId() != null) {
            throw new BadRequestAlertException("A new impactLevel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ImpactLevel result = impactLevelService.save(impactLevel);
        return ResponseEntity.created(new URI("/api/impact-levels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/impact-levels/all")
    @Timed
    @UpdateImpactsHook
    public List<ImpactLevel> createImpactLevels(@Valid @RequestBody List<ImpactLevel> impactLevels) throws IllegalInputException {
        log.debug("REST request to save all ImpactLevels : {}", impactLevels);

        if (impactLevels.stream().filter(impactLevel -> impactLevel.getId() != null).count() > 0) {
            throw new BadRequestAlertException("A new ImpactLevel cannot already have an ID", ENTITY_NAME, "idexists");
        }

        if (!this.impactLevelService.checkValidity(impactLevels)) {
            throw new IllegalInputException("ImpactLevels are NOT VALID!!!");
        }

        List<ImpactLevel> result = this.impactLevelService.saveAll(impactLevels);
        return result;
    }

    @PutMapping("/impact-levels/all")
    @Timed
    @UpdateImpactsHook
    public List<ImpactLevel> updateImpactLevels(@Valid @RequestBody List<ImpactLevel> impactLevels) throws IllegalInputException {
        log.debug("REST request to save all ImpactLevels : {}", impactLevels);

        if (impactLevels.stream().filter(impactLevel -> impactLevel.getId() == null).count() > 0) {
            throw new IllegalInputException("An ImpactLevel to be updated must have an ID");
        }

        if (!this.impactLevelService.checkValidity(impactLevels)) {
            throw new IllegalInputException("ImpactLevels are NOT VALID!!!");
        }

        List<ImpactLevel> result = this.impactLevelService.saveAll(impactLevels);
        return result;
    }

    /**
     * PUT  /impact-levels : Updates an existing impactLevel.
     *
     * @param impactLevel the impactLevel to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated impactLevel,
     * or with status 400 (Bad Request) if the impactLevel is not valid,
     * or with status 500 (Internal Server Error) if the impactLevel couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/impact-levels")
    @Timed
    public ResponseEntity<ImpactLevel> updateImpactLevel(@Valid @RequestBody ImpactLevel impactLevel) throws URISyntaxException {
        log.debug("REST request to update ImpactLevel : {}", impactLevel);
        if (impactLevel.getId() == null) {
            return createImpactLevel(impactLevel);
        }
        ImpactLevel result = impactLevelService.save(impactLevel);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, impactLevel.getId().toString()))
            .body(result);
    }

    /**
     * GET  /impact-levels : get all the impactLevels.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of impactLevels in body
     */
    @GetMapping("/impact-levels")
    @Timed
    public List<ImpactLevel> getAllImpactLevels() {
        log.debug("REST request to get all ImpactLevels");
        return impactLevelService.findAll();
    }

    /**
     * GET  /impact-levels : get all the impactLevels.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of impactLevels in body
     */
    @GetMapping("/{selfAssessmentID}/impact-levels")
    @Timed
    @UpdateImpactsHook
    public List<ImpactLevel> getAllImpactLevelsBySelfAssessment(@PathVariable("selfAssessmentID") Long selfAssessmentID) {
        log.debug("REST request to get all ImpactLevels");
        return impactLevelService.findAllBySelfAssessment(selfAssessmentID);
    }

    /**
     * GET  /impact-levels/:id : get the "id" impactLevel.
     *
     * @param id the id of the impactLevel to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the impactLevel, or with status 404 (Not Found)
     */
    @GetMapping("/impact-levels/{id}")
    @Timed
    public ResponseEntity<ImpactLevel> getImpactLevel(@PathVariable Long id) {
        log.debug("REST request to get ImpactLevel : {}", id);
        ImpactLevel impactLevel = impactLevelService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(impactLevel));
    }

    /**
     * DELETE  /impact-levels/:id : delete the "id" impactLevel.
     *
     * @param id the id of the impactLevel to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/impact-levels/{id}")
    @Timed
    public ResponseEntity<Void> deleteImpactLevel(@PathVariable Long id) {
        log.debug("REST request to delete ImpactLevel : {}", id);
        impactLevelService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
