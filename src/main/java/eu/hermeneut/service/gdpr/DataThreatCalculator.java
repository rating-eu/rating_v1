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

package eu.hermeneut.service.gdpr;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.ThreatArea;

import java.util.List;
import java.util.Set;

public interface DataThreatCalculator {
    DataThreat calculateDataThreat(DataOperation operation, ThreatArea area, List<GDPRQuestion> questions, List<GDPRMyAnswer> myAnswers);

    Set<DataThreat> calculateDataThreats(GDPRQuestionnaireStatus questionnaireStatus);

    OverallDataThreat calculateOverallDataThreat(Set<DataThreat> dataThreats);
}
