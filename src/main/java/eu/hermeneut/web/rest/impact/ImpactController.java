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

package eu.hermeneut.web.rest.impact;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.EconomicResults;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.service.impact.ImpactService;
import eu.hermeneut.utils.tuple.Couple;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing EconomicResults.
 */
@RestController
@RequestMapping("/api")
public class ImpactController {

    private final Logger log = LoggerFactory.getLogger(ImpactController.class);

    private static final String ENTITY_NAME = "economicResults";

    @Autowired
    private ImpactService impactService;

    @Autowired
    private MyAssetService myAssetService;

    /**
     * GET  /economic-results/:id : get the "id" economicResults.
     *
     * @param selfAssessmentID the id of the SelfAssessment of the economicResults to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the economicResults, or with status 404 (Not Found)
     */
    @GetMapping("/{selfAssessmentID}/economic-impact")
    @Timed
    public List<MyAsset> getImpactsBySelfAssessment(@PathVariable Long selfAssessmentID) throws NotFoundException {
        log.debug("REST request to get the impact by selfAssessmentID: {}", selfAssessmentID);

        return this.impactService.calculateEconomicImpacts(selfAssessmentID);
    }

    /**
     * GET  /economic-results/:id : get the "id" economicResults.
     *
     * @param selfAssessmentID the id of the SelfAssessment of the economicResults to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the economicResults, or with status 404 (Not Found)
     */
    @GetMapping("/{selfAssessmentID}/economic-impact/{myAssetID}")
    @Timed
    public ResponseEntity<MyAsset> getImpactByMyAsset(@PathVariable Long selfAssessmentID, @PathVariable Long myAssetID) throws NotFoundException {
        log.debug("REST request to get the impact by selfAssessmentID: {} and myAssetID: {}", selfAssessmentID, myAssetID);

        MyAsset myAsset = this.myAssetService.findOne(myAssetID);

        if (myAsset == null) {
            throw new NotFoundException("MyAsset NOT Found!!!");
        }

        MyAsset result = this.impactService.calculateEconomicImpact(selfAssessmentID, myAssetID);

        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(result));
    }
}
