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
import eu.hermeneut.domain.ExternalAudit;
import eu.hermeneut.service.ExternalAuditService;
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
 * REST controller for managing ExternalAudit.
 */
@RestController
@RequestMapping("/api")
public class ExternalAuditResource {

    private final Logger log = LoggerFactory.getLogger(ExternalAuditResource.class);

    private static final String ENTITY_NAME = "externalAudit";

    private final ExternalAuditService externalAuditService;

    public ExternalAuditResource(ExternalAuditService externalAuditService) {
        this.externalAuditService = externalAuditService;
    }

    /**
     * POST  /external-audits : Create a new externalAudit.
     *
     * @param externalAudit the externalAudit to create
     * @return the ResponseEntity with status 201 (Created) and with body the new externalAudit, or with status 400 (Bad Request) if the externalAudit has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/external-audits")
    @Timed
    public ResponseEntity<ExternalAudit> createExternalAudit(@Valid @RequestBody ExternalAudit externalAudit) throws URISyntaxException {
        log.debug("REST request to save ExternalAudit : {}", externalAudit);
        if (externalAudit.getId() != null) {
            throw new BadRequestAlertException("A new externalAudit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExternalAudit result = externalAuditService.save(externalAudit);
        return ResponseEntity.created(new URI("/api/external-audits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /external-audits : Updates an existing externalAudit.
     *
     * @param externalAudit the externalAudit to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated externalAudit,
     * or with status 400 (Bad Request) if the externalAudit is not valid,
     * or with status 500 (Internal Server Error) if the externalAudit couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/external-audits")
    @Timed
    public ResponseEntity<ExternalAudit> updateExternalAudit(@Valid @RequestBody ExternalAudit externalAudit) throws URISyntaxException {
        log.debug("REST request to update ExternalAudit : {}", externalAudit);
        if (externalAudit.getId() == null) {
            return createExternalAudit(externalAudit);
        }
        ExternalAudit result = externalAuditService.save(externalAudit);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, externalAudit.getId().toString()))
            .body(result);
    }

    /**
     * GET  /external-audits : get all the externalAudits.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of externalAudits in body
     */
    @GetMapping("/external-audits")
    @Timed
    public List<ExternalAudit> getAllExternalAudits() {
        log.debug("REST request to get all ExternalAudits");
        return externalAuditService.findAll();
        }

    /**
     * GET  /external-audits/:id : get the "id" externalAudit.
     *
     * @param id the id of the externalAudit to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the externalAudit, or with status 404 (Not Found)
     */
    @GetMapping("/external-audits/{id}")
    @Timed
    public ResponseEntity<ExternalAudit> getExternalAudit(@PathVariable Long id) {
        log.debug("REST request to get ExternalAudit : {}", id);
        ExternalAudit externalAudit = externalAuditService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(externalAudit));
    }

    /**
     * DELETE  /external-audits/:id : delete the "id" externalAudit.
     *
     * @param id the id of the externalAudit to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/external-audits/{id}")
    @Timed
    public ResponseEntity<Void> deleteExternalAudit(@PathVariable Long id) {
        log.debug("REST request to delete ExternalAudit : {}", id);
        externalAuditService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/external-audits?query=:query : search for the externalAudit corresponding
     * to the query.
     *
     * @param query the query of the externalAudit search
     * @return the result of the search
     */
    @GetMapping("/_search/external-audits")
    @Timed
    public List<ExternalAudit> searchExternalAudits(@RequestParam String query) {
        log.debug("REST request to search ExternalAudits for query {}", query);
        return externalAuditService.search(query);
    }

}
