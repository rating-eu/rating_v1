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

import eu.hermeneut.service.CompanyProfileService;
import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.repository.CompanyProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Service Implementation for managing CompanyProfile.
 */
@Service
@Transactional
public class CompanyProfileServiceImpl implements CompanyProfileService {

    private final Logger log = LoggerFactory.getLogger(CompanyProfileServiceImpl.class);

    private final CompanyProfileRepository companyProfileRepository;

    public CompanyProfileServiceImpl(CompanyProfileRepository companyProfileRepository) {
        this.companyProfileRepository = companyProfileRepository;
    }

    /**
     * Save a companyProfile.
     *
     * @param companyProfile the entity to save
     * @return the persisted entity
     */
    @Override
    public CompanyProfile save(CompanyProfile companyProfile) {
        log.debug("Request to save CompanyProfile : {}", companyProfile);
        CompanyProfile result = companyProfileRepository.save(companyProfile);
        return result;
    }

    /**
     * Get all the companyProfiles.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<CompanyProfile> findAll() {
        log.debug("Request to get all CompanyProfiles");
        return companyProfileRepository.findAll();
    }

    /**
     * Get one companyProfile by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public CompanyProfile findOne(Long id) {
        log.debug("Request to get CompanyProfile : {}", id);
        return companyProfileRepository.findOne(id);
    }

    /**
     * Delete the companyProfile by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete CompanyProfile : {}", id);
        companyProfileRepository.delete(id);
    }
}
