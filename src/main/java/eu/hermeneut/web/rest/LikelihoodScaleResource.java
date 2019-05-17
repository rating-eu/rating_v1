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
import eu.hermeneut.domain.LikelihoodScale;
import eu.hermeneut.service.LikelihoodScaleService;
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
 * REST controller for managing LikelihoodScale.
 */
@RestController
@RequestMapping("/api")
public class LikelihoodScaleResource {

    private final Logger log = LoggerFactory.getLogger(LikelihoodScaleResource.class);

    private static final String ENTITY_NAME = "likelihoodScale";

    private final LikelihoodScaleService likelihoodScaleService;

    public LikelihoodScaleResource(LikelihoodScaleService likelihoodScaleService) {
        this.likelihoodScaleService = likelihoodScaleService;
    }

    /**
     * POST  /likelihood-scales : Create a new likelihoodScale.
     *
     * @param likelihoodScale the likelihoodScale to create
     * @return the ResponseEntity with status 201 (Created) and with body the new likelihoodScale, or with status 400 (Bad Request) if the likelihoodScale has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/likelihood-scales")
    @Timed
    public ResponseEntity<LikelihoodScale> createLikelihoodScale(@Valid @RequestBody LikelihoodScale likelihoodScale) throws URISyntaxException {
        log.debug("REST request to save LikelihoodScale : {}", likelihoodScale);
        if (likelihoodScale.getId() != null) {
            throw new BadRequestAlertException("A new likelihoodScale cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LikelihoodScale result = likelihoodScaleService.save(likelihoodScale);
        return ResponseEntity.created(new URI("/api/likelihood-scales/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /likelihood-scales : Updates an existing likelihoodScale.
     *
     * @param likelihoodScale the likelihoodScale to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated likelihoodScale,
     * or with status 400 (Bad Request) if the likelihoodScale is not valid,
     * or with status 500 (Internal Server Error) if the likelihoodScale couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/likelihood-scales")
    @Timed
    public ResponseEntity<LikelihoodScale> updateLikelihoodScale(@Valid @RequestBody LikelihoodScale likelihoodScale) throws URISyntaxException {
        log.debug("REST request to update LikelihoodScale : {}", likelihoodScale);
        if (likelihoodScale.getId() == null) {
            return createLikelihoodScale(likelihoodScale);
        }
        LikelihoodScale result = likelihoodScaleService.save(likelihoodScale);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, likelihoodScale.getId().toString()))
            .body(result);
    }

    /**
     * GET  /likelihood-scales : get all the likelihoodScales.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of likelihoodScales in body
     */
    @GetMapping("/likelihood-scales")
    @Timed
    public List<LikelihoodScale> getAllLikelihoodScales() {
        log.debug("REST request to get all LikelihoodScales");
        return likelihoodScaleService.findAll();
    }

    /**
     * GET  /likelihood-scales : get all the likelihoodScales of the input SelfAssessment..
     *
     * @return the ResponseEntity with status 200 (OK) and the list of likelihoodScales in body
     */
    @GetMapping("/likelihood-scales/self-assessment/{selfAssessmentID}")
    @Timed
    public List<LikelihoodScale> getAllLikelihoodScalesBySelfAssessment(@PathVariable Long selfAssessmentID) {
        log.debug("REST request to get all LikelihoodScales by SelfAssessment: " + selfAssessmentID);
        return likelihoodScaleService.findAllBySelfAssessment(selfAssessmentID);
    }

    /**
     * GET  /likelihood-scales/:id : get the "id" likelihoodScale.
     *
     * @param id the id of the likelihoodScale to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the likelihoodScale, or with status 404 (Not Found)
     */
    @GetMapping("/likelihood-scales/{id}")
    @Timed
    public ResponseEntity<LikelihoodScale> getLikelihoodScale(@PathVariable Long id) {
        log.debug("REST request to get LikelihoodScale : {}", id);
        LikelihoodScale likelihoodScale = likelihoodScaleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(likelihoodScale));
    }

    /**
     * DELETE  /likelihood-scales/:id : delete the "id" likelihoodScale.
     *
     * @param id the id of the likelihoodScale to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/likelihood-scales/{id}")
    @Timed
    public ResponseEntity<Void> deleteLikelihoodScale(@PathVariable Long id) {
        log.debug("REST request to delete LikelihoodScale : {}", id);
        likelihoodScaleService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
