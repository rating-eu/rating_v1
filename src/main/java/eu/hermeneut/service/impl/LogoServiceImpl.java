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

import eu.hermeneut.service.LogoService;
import eu.hermeneut.domain.Logo;
import eu.hermeneut.repository.LogoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing Logo.
 */
@Service
@Transactional
public class LogoServiceImpl implements LogoService {

    private final Logger log = LoggerFactory.getLogger(LogoServiceImpl.class);

    private final LogoRepository logoRepository;

    public LogoServiceImpl(LogoRepository logoRepository) {
        this.logoRepository = logoRepository;
    }

    /**
     * Save a logo.
     *
     * @param logo the entity to save
     * @return the persisted entity
     */
    @Override
    public Logo save(Logo logo) {
        log.debug("Request to save Logo : {}", logo);
        Logo result = logoRepository.save(logo);
        return result;
    }

    /**
     * Get all the logos.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Logo> findAll() {
        log.debug("Request to get all Logos");
        return logoRepository.findAll();
    }

    /**
     * Get one logo by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Logo findOne(Long id) {
        log.debug("Request to get Logo : {}", id);
        return logoRepository.findOne(id);
    }

    /**
     * Delete the logo by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Logo : {}", id);
        logoRepository.delete(id);
    }

    @Override
    public Logo getSecondaryLogo() {
        log.debug("Request to get Secondary Logo");
        return logoRepository.findSecondaryLogo();
    }
}
