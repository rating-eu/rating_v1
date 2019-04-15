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
import eu.hermeneut.domain.Mitigation;
import eu.hermeneut.service.MitigationService;
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
 * REST controller for managing Mitigation.
 */
@RestController
@RequestMapping("/api")
public class MitigationResource {

    private final Logger log = LoggerFactory.getLogger(MitigationResource.class);

    private static final String ENTITY_NAME = "mitigation";

    private final MitigationService mitigationService;

    public MitigationResource(MitigationService mitigationService) {
        this.mitigationService = mitigationService;
    }

    /**
     * POST  /mitigations : Create a new mitigation.
     *
     * @param mitigation the mitigation to create
     * @return the ResponseEntity with status 201 (Created) and with body the new mitigation, or with status 400 (Bad Request) if the mitigation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/mitigations")
    @Timed
    public ResponseEntity<Mitigation> createMitigation(@Valid @RequestBody Mitigation mitigation) throws URISyntaxException {
        log.debug("REST request to save Mitigation : {}", mitigation);
        if (mitigation.getId() != null) {
            throw new BadRequestAlertException("A new mitigation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Mitigation result = mitigationService.save(mitigation);
        return ResponseEntity.created(new URI("/api/mitigations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /mitigations : Updates an existing mitigation.
     *
     * @param mitigation the mitigation to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated mitigation,
     * or with status 400 (Bad Request) if the mitigation is not valid,
     * or with status 500 (Internal Server Error) if the mitigation couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/mitigations")
    @Timed
    public ResponseEntity<Mitigation> updateMitigation(@Valid @RequestBody Mitigation mitigation) throws URISyntaxException {
        log.debug("REST request to update Mitigation : {}", mitigation);
        if (mitigation.getId() == null) {
            return createMitigation(mitigation);
        }
        Mitigation result = mitigationService.save(mitigation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, mitigation.getId().toString()))
            .body(result);
    }

    /**
     * GET  /mitigations : get all the mitigations.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of mitigations in body
     */
    @GetMapping("/mitigations")
    @Timed
    public List<Mitigation> getAllMitigations() {
        log.debug("REST request to get all Mitigations");
        return mitigationService.findAll();
        }

    /**
     * GET  /mitigations/:id : get the "id" mitigation.
     *
     * @param id the id of the mitigation to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the mitigation, or with status 404 (Not Found)
     */
    @GetMapping("/mitigations/{id}")
    @Timed
    public ResponseEntity<Mitigation> getMitigation(@PathVariable Long id) {
        log.debug("REST request to get Mitigation : {}", id);
        Mitigation mitigation = mitigationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(mitigation));
    }

    /**
     * DELETE  /mitigations/:id : delete the "id" mitigation.
     *
     * @param id the id of the mitigation to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/mitigations/{id}")
    @Timed
    public ResponseEntity<Void> deleteMitigation(@PathVariable Long id) {
        log.debug("REST request to delete Mitigation : {}", id);
        mitigationService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/mitigations?query=:query : search for the mitigation corresponding
     * to the query.
     *
     * @param query the query of the mitigation search
     * @return the result of the search
     */
    @GetMapping("/_search/mitigations")
    @Timed
    public List<Mitigation> searchMitigations(@RequestParam String query) {
        log.debug("REST request to search Mitigations for query {}", query);
        return mitigationService.search(query);
    }

}
