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

package eu.hermeneut.service;

import eu.hermeneut.domain.enumeration.Status;

public interface DashboardStatusService {
    Status getAssetClusteringStatus(Long selfAssessmentID);

    Status getIdentifyThreatAgentsStatus(Long selfAssessmentID);

    Status getAssessVulnerabilitiesStatus(Long selfAssessmentID);

    Status getRefineVulnerabilitiesStatus(Long selfAssessmentID);

    Status getImpactEvaluationStatus(Long selfAssessmentID);

    Status getRiskEvaluationStatus(Long selfAssessmentID);

    Status getAttackRelatedCostsStatus(Long selfAssessmentID);
}
