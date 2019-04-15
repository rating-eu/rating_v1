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

import eu.hermeneut.domain.Criticality;
import eu.hermeneut.domain.compact.output.CriticalityType;

import java.util.List;

public interface CriticalityService {
    Criticality save(Criticality criticality);

    List<Criticality> findAll();

    List<Criticality> findAllByCompanyProfileID(Long companyProfileID);

    Criticality findOneByCompanyProfileAttackStrategyAndCriticalityType(Long companyProfileID, Long attackSTrategyID, CriticalityType criticalityType);

    Criticality findOne(Long id);

    void delete(Long id);
}
