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

package eu.hermeneut.web.rest.compact;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.compact.input.RiskProfile;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.compact.RiskProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RiskProfileController {
    private final Logger log = LoggerFactory.getLogger(RiskProfileController.class);

    @Autowired
    private RiskProfileService riskProfileService;

    //@Autowired
    //private MessageSenderService messageSenderService;

    @GetMapping("{selfAssessmentID}/risk-profile")
    @Timed
    public RiskProfile getRiskProfile(@PathVariable("selfAssessmentID") Long selfAssessmentID) throws NotFoundException {
        return this.riskProfileService.getRiskProfile(selfAssessmentID);
    }

    /*@GetMapping("{selfAssessmentID}/risk-profile/kafka")
    @Timed
    public void sendRiskProfile(@PathVariable("selfAssessmentID") Long selfAssessmentID) {
        RiskProfile riskProfile = null;

        try {
            riskProfile = this.riskProfileService.getRiskProfile(selfAssessmentID);
            this.messageSenderService.sendRiskProfile(selfAssessmentID);
        } catch (NotFoundException e) {
            e.printStackTrace();
        } catch (NullInputException e) {
            e.printStackTrace();
        }
    }*/
}
