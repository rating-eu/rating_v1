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

import eu.hermeneut.service.MyCompanyService;
import eu.hermeneut.domain.MyCompany;
import eu.hermeneut.repository.MyCompanyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Service Implementation for managing MyCompany.
 */
@Service
@Transactional
public class MyCompanyServiceImpl implements MyCompanyService {

    private final Logger log = LoggerFactory.getLogger(MyCompanyServiceImpl.class);

    private final MyCompanyRepository myCompanyRepository;

    public MyCompanyServiceImpl(MyCompanyRepository myCompanyRepository) {
        this.myCompanyRepository = myCompanyRepository;
    }

    /**
     * Save a myCompany.
     *
     * @param myCompany the entity to save
     * @return the persisted entity
     */
    @Override
    public MyCompany save(MyCompany myCompany) {
        log.debug("Request to save MyCompany : {}", myCompany);
        MyCompany result = myCompanyRepository.save(myCompany);
        return result;
    }

    /**
     * Get all the myCompanies.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyCompany> findAll() {
        log.debug("Request to get all MyCompanies");
        return myCompanyRepository.findAll();
    }

    /**
     * Get one myCompany by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public MyCompany findOne(Long id) {
        log.debug("Request to get MyCompany : {}", id);
        return myCompanyRepository.findOne(id);
    }

    /**
     * Delete the myCompany by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete MyCompany : {}", id);
        myCompanyRepository.delete(id);
    }

    @Override
    public MyCompany findOneByUser(Long userID) {
        log.debug("Request to get MyCompany by user: {}", userID);
        return myCompanyRepository.findOneByUser(userID);
    }
}
