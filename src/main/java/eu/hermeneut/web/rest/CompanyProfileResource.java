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
import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.service.CompanyProfileService;
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
 * REST controller for managing CompanyProfile.
 */
@RestController
@RequestMapping("/api")
public class CompanyProfileResource {

    private final Logger log = LoggerFactory.getLogger(CompanyProfileResource.class);

    private static final String ENTITY_NAME = "companyProfile";

    private final CompanyProfileService companyProfileService;

    public CompanyProfileResource(CompanyProfileService companyProfileService) {
        this.companyProfileService = companyProfileService;
    }

    /**
     * POST  /company-profiles : Create a new companyProfile.
     *
     * @param companyProfile the companyProfile to create
     * @return the ResponseEntity with status 201 (Created) and with body the new companyProfile, or with status 400 (Bad Request) if the companyProfile has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/company-profiles")
    @Timed
    public ResponseEntity<CompanyProfile> createCompanyProfile(@Valid @RequestBody CompanyProfile companyProfile) throws URISyntaxException {
        log.debug("REST request to save CompanyProfile : {}", companyProfile);
        if (companyProfile.getId() != null) {
            throw new BadRequestAlertException("A new companyProfile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CompanyProfile result = companyProfileService.save(companyProfile);
        return ResponseEntity.created(new URI("/api/company-profiles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /company-profiles : Updates an existing companyProfile.
     *
     * @param companyProfile the companyProfile to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated companyProfile,
     * or with status 400 (Bad Request) if the companyProfile is not valid,
     * or with status 500 (Internal Server Error) if the companyProfile couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/company-profiles")
    @Timed
    public ResponseEntity<CompanyProfile> updateCompanyProfile(@Valid @RequestBody CompanyProfile companyProfile) throws URISyntaxException {
        log.debug("REST request to update CompanyProfile : {}", companyProfile);
        if (companyProfile.getId() == null) {
            return createCompanyProfile(companyProfile);
        }
        CompanyProfile result = companyProfileService.save(companyProfile);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, companyProfile.getId().toString()))
            .body(result);
    }

    /**
     * GET  /company-profiles : get all the companyProfiles.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of companyProfiles in body
     */
    @GetMapping("/company-profiles")
    @Timed
    public List<CompanyProfile> getAllCompanyProfiles() {
        log.debug("REST request to get all CompanyProfiles");
        return companyProfileService.findAll();
        }

    /**
     * GET  /company-profiles/:id : get the "id" companyProfile.
     *
     * @param id the id of the companyProfile to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the companyProfile, or with status 404 (Not Found)
     */
    @GetMapping("/company-profiles/{id}")
    @Timed
    public ResponseEntity<CompanyProfile> getCompanyProfile(@PathVariable Long id) {
        log.debug("REST request to get CompanyProfile : {}", id);
        CompanyProfile companyProfile = companyProfileService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(companyProfile));
    }

    /**
     * DELETE  /company-profiles/:id : delete the "id" companyProfile.
     *
     * @param id the id of the companyProfile to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/company-profiles/{id}")
    @Timed
    public ResponseEntity<Void> deleteCompanyProfile(@PathVariable Long id) {
        log.debug("REST request to delete CompanyProfile : {}", id);
        companyProfileService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
