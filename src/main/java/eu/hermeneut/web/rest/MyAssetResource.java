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
import eu.hermeneut.aop.annotation.AttackCostParamsCleaningHook;
import eu.hermeneut.aop.annotation.KafkaRiskProfileHook;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.web.rest.errors.BadRequestAlertException;
import eu.hermeneut.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.hibernate.validator.constraints.NotEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing MyAsset.
 */
@RestController
@RequestMapping("/api")
public class MyAssetResource {

    private final Logger log = LoggerFactory.getLogger(MyAssetResource.class);

    private static final String ENTITY_NAME = "myAsset";

    private final MyAssetService myAssetService;

    public MyAssetResource(MyAssetService myAssetService) {
        this.myAssetService = myAssetService;
    }

    /**
     * POST  /my-assets : Create a new myAsset.
     *
     * @param myAsset the myAsset to create
     * @return the ResponseEntity with status 201 (Created) and with body the new myAsset, or with status 400 (Bad Request) if the myAsset has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/my-assets")
    @Timed
    @PreAuthorize("@myAssetGuardian.isCISO(#myAsset) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public ResponseEntity<MyAsset> createMyAsset(@RequestBody MyAsset myAsset) throws URISyntaxException {
        log.debug("REST request to save MyAsset : {}", myAsset);
        if (myAsset.getId() != null) {
            throw new BadRequestAlertException("A new myAsset cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MyAsset result = myAssetService.save(myAsset);
        return ResponseEntity.created(new URI("/api/my-assets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/{selfAssessmentID}/my-assets/all")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public List<MyAsset> createMyAssets(@PathVariable("selfAssessmentID") Long selfAssessmentID, @RequestBody @NotEmpty List<MyAsset> myAssets) throws IllegalInputException, NullInputException {
        log.debug("REST request to save MyAssets : {}", myAssets);

        if (selfAssessmentID == null) {
            throw new NullInputException("SelfAssessmentID CANNOT be NULL!");
        }

        if (myAssets == null || myAssets.isEmpty()) {
            throw new IllegalInputException("MyAssets parameter CANNOT be NULL or EMPTY!");
        }

        for (MyAsset myAsset : myAssets) {
            if (myAsset.getSelfAssessment().getId() != (long) selfAssessmentID) {
                throw new IllegalInputException("MyAssets MUST belong to the input SelfAssessment ID");
            }
        }

        //We can't simply DELETE all the old ones, otherwise all the existing relations would be lost.
        //Instead we need to delete the difference between the old and the new ones.
        List<MyAsset> myExistingAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

        //Only the MyAssets to DELETE will remain in this map.
        Map<Long, MyAsset> myExistingAssetsDiffMap = myExistingAssets
            .stream()
            .collect(Collectors.toMap(
                myAsset -> myAsset.getId(),
                Function.identity()
            ));

        //Remove the "Confirmed MyAssets" (ID != null) from the diff map.
        myAssets
            .stream()
            .filter(myAsset -> myAsset.getId() != null)
            .forEach((myAsset) -> {
                myExistingAssetsDiffMap.remove(myAsset.getId());
            });

        List<MyAsset> myAssetsDiff = myExistingAssetsDiffMap
            .values()
            .stream()
            .collect(Collectors.toList());

        for (MyAsset myAsset : myAssetsDiff) {
            this.myAssetService.delete(myAsset.getId());
        }

        //Save the new ones
        return this.myAssetService.saveAll(myAssets);
    }

    /**
     * PUT  /my-assets : Updates an existing myAsset.
     *
     * @param myAsset the myAsset to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated myAsset,
     * or with status 400 (Bad Request) if the myAsset is not valid,
     * or with status 500 (Internal Server Error) if the myAsset couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/my-assets")
    @Timed
    @KafkaRiskProfileHook
    @AttackCostParamsCleaningHook
    @PreAuthorize("@myAssetGuardian.isCISO(#myAsset) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public ResponseEntity<MyAsset> updateMyAsset(@RequestBody @NotNull MyAsset myAsset) throws URISyntaxException {
        log.debug("REST request to update MyAsset : {}", myAsset);
        if (myAsset.getId() == null) {
            return createMyAsset(myAsset);
        }

        MyAsset result = myAssetService.save(myAsset);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, myAsset.getId().toString()))
            .body(result);
    }

    /**
     * GET  /my-assets : get all the myAssets.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of myAssets in body
     */
    @GetMapping("/my-assets")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public List<MyAsset> getAllMyAssets() {
        log.debug("REST request to get all MyAssets");
        return myAssetService.findAll();
    }

    @GetMapping("/my-assets/self-assessment/{selfAssessmentID}")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public List<MyAsset> getMyAssetsBySelfAssessment(@PathVariable Long selfAssessmentID) {
        log.debug("REST request to get all MyAssets by SelfAssessment ID");
        return myAssetService.findAllBySelfAssessment(selfAssessmentID);
    }

    /**
     * GET  /my-assets/:id : get the "id" myAsset.
     *
     * @param id the id of the myAsset to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the myAsset, or with status 404 (Not Found)
     */
    @GetMapping("/my-assets/{id}")
    @Timed
    @PreAuthorize("@myAssetGuardian.isCISO(#id) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public ResponseEntity<MyAsset> getMyAsset(@PathVariable Long id) {
        log.debug("REST request to get MyAsset : {}", id);
        MyAsset myAsset = myAssetService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(myAsset));
    }

    /**
     * DELETE  /my-assets/:id : delete the "id" myAsset.
     *
     * @param id the id of the myAsset to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/my-assets/{id}")
    @Timed
    @PreAuthorize("@myAssetGuardian.isCISO(#id) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public ResponseEntity<Void> deleteMyAsset(@PathVariable Long id) {
        log.debug("REST request to delete MyAsset : {}", id);
        myAssetService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/my-assets?query=:query : search for the myAsset corresponding
     * to the query.
     *
     * @param query the query of the myAsset search
     * @return the result of the search
     */
    @GetMapping("/_search/my-assets")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public List<MyAsset> searchMyAssets(@RequestParam String query) {
        log.debug("REST request to search MyAssets for query {}", query);
        return myAssetService.search(query);
    }

}
