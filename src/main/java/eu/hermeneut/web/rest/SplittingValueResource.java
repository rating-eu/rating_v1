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
import eu.hermeneut.domain.SplittingValue;
import eu.hermeneut.service.SplittingValueService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing SplittingValue.
 */
@RestController
@RequestMapping("/api")
public class SplittingValueResource {

    private final Logger log = LoggerFactory.getLogger(SplittingValueResource.class);

    private static final String ENTITY_NAME = "splittingValue";

    private final SplittingValueService splittingValueService;

    public SplittingValueResource(SplittingValueService splittingValueService) {
        this.splittingValueService = splittingValueService;
    }

    /**
     * POST  /splitting-values : Create a new splittingValue.
     *
     * @param splittingValue the splittingValue to create
     * @return the ResponseEntity with status 201 (Created) and with body the new splittingValue, or with status 400 (Bad Request) if the splittingValue has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/splitting-values")
    @Timed
    public ResponseEntity<SplittingValue> createSplittingValue(@RequestBody SplittingValue splittingValue) throws URISyntaxException {
        log.debug("REST request to save SplittingValue : {}", splittingValue);
        if (splittingValue.getId() != null) {
            throw new BadRequestAlertException("A new splittingValue cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SplittingValue result = splittingValueService.save(splittingValue);
        return ResponseEntity.created(new URI("/api/splitting-values/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /splitting-values : Updates an existing splittingValue.
     *
     * @param splittingValue the splittingValue to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated splittingValue,
     * or with status 400 (Bad Request) if the splittingValue is not valid,
     * or with status 500 (Internal Server Error) if the splittingValue couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/splitting-values")
    @Timed
    public ResponseEntity<SplittingValue> updateSplittingValue(@RequestBody SplittingValue splittingValue) throws URISyntaxException {
        log.debug("REST request to update SplittingValue : {}", splittingValue);
        if (splittingValue.getId() == null) {
            return createSplittingValue(splittingValue);
        }
        SplittingValue result = splittingValueService.save(splittingValue);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, splittingValue.getId().toString()))
            .body(result);
    }

    /**
     * GET  /splitting-values : get all the splittingValues.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of splittingValues in body
     */
    @GetMapping("/splitting-values")
    @Timed
    public List<SplittingValue> getAllSplittingValues() {
        log.debug("REST request to get all SplittingValues");
        return splittingValueService.findAll();
        }

    /**
     * GET  /splitting-values/:id : get the "id" splittingValue.
     *
     * @param id the id of the splittingValue to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the splittingValue, or with status 404 (Not Found)
     */
    @GetMapping("/splitting-values/{id}")
    @Timed
    public ResponseEntity<SplittingValue> getSplittingValue(@PathVariable Long id) {
        log.debug("REST request to get SplittingValue : {}", id);
        SplittingValue splittingValue = splittingValueService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(splittingValue));
    }

    /**
     * DELETE  /splitting-values/:id : delete the "id" splittingValue.
     *
     * @param id the id of the splittingValue to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/splitting-values/{id}")
    @Timed
    public ResponseEntity<Void> deleteSplittingValue(@PathVariable Long id) {
        log.debug("REST request to delete SplittingValue : {}", id);
        splittingValueService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/splitting-values?query=:query : search for the splittingValue corresponding
     * to the query.
     *
     * @param query the query of the splittingValue search
     * @return the result of the search
     */
    @GetMapping("/_search/splitting-values")
    @Timed
    public List<SplittingValue> searchSplittingValues(@RequestParam String query) {
        log.debug("REST request to search SplittingValues for query {}", query);
        return splittingValueService.search(query);
    }

}
