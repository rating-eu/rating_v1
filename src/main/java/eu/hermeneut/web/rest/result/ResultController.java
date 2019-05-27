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

package eu.hermeneut.web.rest.result;

import eu.hermeneut.domain.enumeration.*;
import eu.hermeneut.domain.result.Result;
import eu.hermeneut.service.result.ResultService;
import eu.hermeneut.utils.likelihood.overall.OverallCalculator;
import eu.hermeneut.web.rest.AssetResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing the result.
 */
@RestController
@RequestMapping("/api")
public class ResultController {
    private final Logger log = LoggerFactory.getLogger(AssetResource.class);

    @Autowired
    private ResultService resultService;

    @GetMapping("/likelihood/max")
    public int getMaxLikelihood() {
        final int numerator = AttackStrategyLikelihood.HIGH.getValue() * 5/*1+1+1+1+1*/ + AttackStrategyLikelihood.HIGH.getValue() * 5/*5*/;
        return numerator / OverallCalculator.DENOMINATOR;
    }

    @GetMapping("/result/{companyProfileID}")
    public Result getResult(@PathVariable Long companyProfileID) {
        return this.resultService.getThreatAgentsResult(companyProfileID);
    }
}
