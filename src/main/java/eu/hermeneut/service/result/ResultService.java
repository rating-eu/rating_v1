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

package eu.hermeneut.service.result;

import eu.hermeneut.domain.ThreatAgent;
import eu.hermeneut.domain.result.Result;

import java.util.Map;
import java.util.Set;

public interface ResultService {
    Result getThreatAgentsResult(Long selfAssessmentID);

    Float getOverallLikelihood(Long selfAssessmentID);

    /**
     * Returns a MAP where the key is the ID of the Threat-Agent
     * and the value is its Level of Interest.
     *
     * @param selfAssessmentID the DI of the SelfAssessment
     * @return the MAP of the levels of interest of the threat-agents
     */
    Map<Long, Float> getLevelsOfInterest(Long selfAssessmentID);


    Set<ThreatAgent> getThreatAgents(Long companyProfileID);
}
