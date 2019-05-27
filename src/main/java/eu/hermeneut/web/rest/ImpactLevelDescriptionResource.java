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
import eu.hermeneut.domain.ImpactLevelDescription;
import eu.hermeneut.service.ImpactLevelDescriptionService;
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
 * REST controller for managing ImpactLevelDescription.
 */
@RestController
@RequestMapping("/api")
public class ImpactLevelDescriptionResource {

    private final Logger log = LoggerFactory.getLogger(ImpactLevelDescriptionResource.class);

    private static final String ENTITY_NAME = "impactLevelDescription";

    private final ImpactLevelDescriptionService impactLevelDescriptionService;

    public ImpactLevelDescriptionResource(ImpactLevelDescriptionService impactLevelDescriptionService) {
        this.impactLevelDescriptionService = impactLevelDescriptionService;
    }

    /**
     * POST  /impact-level-descriptions : Create a new impactLevelDescription.
     *
     * @param impactLevelDescription the impactLevelDescription to create
     * @return the ResponseEntity with status 201 (Created) and with body the new impactLevelDescription, or with status 400 (Bad Request) if the impactLevelDescription has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/impact-level-descriptions")
    @Timed
    public ResponseEntity<ImpactLevelDescription> createImpactLevelDescription(@Valid @RequestBody ImpactLevelDescription impactLevelDescription) throws URISyntaxException {
        log.debug("REST request to save ImpactLevelDescription : {}", impactLevelDescription);
        if (impactLevelDescription.getId() != null) {
            throw new BadRequestAlertException("A new impactLevelDescription cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ImpactLevelDescription result = impactLevelDescriptionService.save(impactLevelDescription);
        return ResponseEntity.created(new URI("/api/impact-level-descriptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /impact-level-descriptions : Updates an existing impactLevelDescription.
     *
     * @param impactLevelDescription the impactLevelDescription to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated impactLevelDescription,
     * or with status 400 (Bad Request) if the impactLevelDescription is not valid,
     * or with status 500 (Internal Server Error) if the impactLevelDescription couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/impact-level-descriptions")
    @Timed
    public ResponseEntity<ImpactLevelDescription> updateImpactLevelDescription(@Valid @RequestBody ImpactLevelDescription impactLevelDescription) throws URISyntaxException {
        log.debug("REST request to update ImpactLevelDescription : {}", impactLevelDescription);
        if (impactLevelDescription.getId() == null) {
            return createImpactLevelDescription(impactLevelDescription);
        }
        ImpactLevelDescription result = impactLevelDescriptionService.save(impactLevelDescription);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, impactLevelDescription.getId().toString()))
            .body(result);
    }

    /**
     * GET  /impact-level-descriptions : get all the impactLevelDescriptions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of impactLevelDescriptions in body
     */
    @GetMapping("/impact-level-descriptions")
    @Timed
    public List<ImpactLevelDescription> getAllImpactLevelDescriptions() {
        log.debug("REST request to get all ImpactLevelDescriptions");
        return impactLevelDescriptionService.findAll();
        }

    /**
     * GET  /impact-level-descriptions/:id : get the "id" impactLevelDescription.
     *
     * @param id the id of the impactLevelDescription to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the impactLevelDescription, or with status 404 (Not Found)
     */
    @GetMapping("/impact-level-descriptions/{id}")
    @Timed
    public ResponseEntity<ImpactLevelDescription> getImpactLevelDescription(@PathVariable Long id) {
        log.debug("REST request to get ImpactLevelDescription : {}", id);
        ImpactLevelDescription impactLevelDescription = impactLevelDescriptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(impactLevelDescription));
    }

    /**
     * DELETE  /impact-level-descriptions/:id : delete the "id" impactLevelDescription.
     *
     * @param id the id of the impactLevelDescription to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/impact-level-descriptions/{id}")
    @Timed
    public ResponseEntity<Void> deleteImpactLevelDescription(@PathVariable Long id) {
        log.debug("REST request to delete ImpactLevelDescription : {}", id);
        impactLevelDescriptionService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
