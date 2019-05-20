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

import eu.hermeneut.domain.wp4.ThreatAgentInterest;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.ThreatAgentInterestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ThreatAgentInterestResource {

    @Autowired
    private ThreatAgentInterestService threatAgentInterestService;

    @GetMapping("/{companyProfileID}/threat-agent-interests")
    public List<ThreatAgentInterest> getThreatAgentInterestsByCompanyProfile(@PathVariable Long companyProfileID) throws NotFoundException {
        return this.threatAgentInterestService.getThreatAgentInterestsByCompanyProfile(companyProfileID);
    }

    @GetMapping("/{companyProfileID}/threat-agent-interests/my-asset/{myAssetID}")
    public List<ThreatAgentInterest> getThreatAgentInterestsByCompanyProfileAndMyAsset(@PathVariable Long companyProfileID, @PathVariable Long myAssetID) throws NotFoundException {
        return this.threatAgentInterestService.getThreatAgentInterestsByCompanyProfileAndMyAsset(companyProfileID, myAssetID);
    }
}
