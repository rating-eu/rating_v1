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
import eu.hermeneut.domain.Motivation;
import eu.hermeneut.service.MotivationService;
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
 * REST controller for managing Motivation.
 */
@RestController
@RequestMapping("/api")
public class MotivationResource {

    private final Logger log = LoggerFactory.getLogger(MotivationResource.class);

    private static final String ENTITY_NAME = "motivation";

    private final MotivationService motivationService;

    public MotivationResource(MotivationService motivationService) {
        this.motivationService = motivationService;
    }

    /**
     * POST  /motivations : Create a new motivation.
     *
     * @param motivation the motivation to create
     * @return the ResponseEntity with status 201 (Created) and with body the new motivation, or with status 400 (Bad Request) if the motivation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/motivations")
    @Timed
    public ResponseEntity<Motivation> createMotivation(@Valid @RequestBody Motivation motivation) throws URISyntaxException {
        log.debug("REST request to save Motivation : {}", motivation);
        if (motivation.getId() != null) {
            throw new BadRequestAlertException("A new motivation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Motivation result = motivationService.save(motivation);
        return ResponseEntity.created(new URI("/api/motivations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /motivations : Updates an existing motivation.
     *
     * @param motivation the motivation to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated motivation,
     * or with status 400 (Bad Request) if the motivation is not valid,
     * or with status 500 (Internal Server Error) if the motivation couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/motivations")
    @Timed
    public ResponseEntity<Motivation> updateMotivation(@Valid @RequestBody Motivation motivation) throws URISyntaxException {
        log.debug("REST request to update Motivation : {}", motivation);
        if (motivation.getId() == null) {
            return createMotivation(motivation);
        }
        Motivation result = motivationService.save(motivation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, motivation.getId().toString()))
            .body(result);
    }

    /**
     * GET  /motivations : get all the motivations.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of motivations in body
     */
    @GetMapping("/motivations")
    @Timed
    public List<Motivation> getAllMotivations() {
        log.debug("REST request to get all Motivations");
        return motivationService.findAll();
        }

    /**
     * GET  /motivations/:id : get the "id" motivation.
     *
     * @param id the id of the motivation to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the motivation, or with status 404 (Not Found)
     */
    @GetMapping("/motivations/{id}")
    @Timed
    public ResponseEntity<Motivation> getMotivation(@PathVariable Long id) {
        log.debug("REST request to get Motivation : {}", id);
        Motivation motivation = motivationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(motivation));
    }

    /**
     * DELETE  /motivations/:id : delete the "id" motivation.
     *
     * @param id the id of the motivation to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/motivations/{id}")
    @Timed
    public ResponseEntity<Void> deleteMotivation(@PathVariable Long id) {
        log.debug("REST request to delete Motivation : {}", id);
        motivationService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
