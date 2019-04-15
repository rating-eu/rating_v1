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

package eu.hermeneut.service.impl;

import eu.hermeneut.domain.Criticality;
import eu.hermeneut.domain.compact.output.CriticalityType;
import eu.hermeneut.repository.CriticalityRepository;
import eu.hermeneut.service.CriticalityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CriticalityServiceImpl implements CriticalityService {
    @Autowired
    private CriticalityRepository criticalityRepository;

    @Override
    public Criticality save(Criticality criticality) {
        return this.criticalityRepository.save(criticality);
    }

    @Override
    public List<Criticality> findAll() {
        return this.criticalityRepository.findAll();
    }

    @Override
    public List<Criticality> findAllByCompanyProfileID(Long companyProfileID) {
        return this.criticalityRepository.findAllByCompanyProfile(companyProfileID);
    }

    @Override
    public Criticality findOneByCompanyProfileAttackStrategyAndCriticalityType(Long companyProfileID, Long attackSTrategyID, CriticalityType criticalityType) {
        return this.criticalityRepository.findOneByCompanyProfileAttackStrategyAndCriticalityType(companyProfileID, attackSTrategyID, criticalityType);
    }

    @Override
    public Criticality findOne(Long id) {
        return this.criticalityRepository.findOne(id);
    }

    @Override
    public void delete(Long id) {
        this.criticalityRepository.delete(id);
    }
}
