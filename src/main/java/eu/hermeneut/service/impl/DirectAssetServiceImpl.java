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

import eu.hermeneut.domain.IndirectAsset;
import eu.hermeneut.service.DirectAssetService;
import eu.hermeneut.domain.DirectAsset;
import eu.hermeneut.repository.DirectAssetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

/**
 * Service Implementation for managing DirectAsset.
 */
@Service
@Transactional
public class DirectAssetServiceImpl implements DirectAssetService {

    private final Logger log = LoggerFactory.getLogger(DirectAssetServiceImpl.class);

    private final DirectAssetRepository directAssetRepository;

    public DirectAssetServiceImpl(DirectAssetRepository directAssetRepository) {
        this.directAssetRepository = directAssetRepository;
    }

    /**
     * Save a directAsset.
     *
     * @param directAsset the entity to save
     * @return the persisted entity
     */
    @Override
    public DirectAsset save(DirectAsset directAsset) {
        log.debug("Request to save DirectAsset : {}", directAsset);

        if (directAsset.getId() != null) {
            DirectAsset existingDirectAsset = this.directAssetRepository.findOne(directAsset.getId());

            if (existingDirectAsset != null) {
                //clear its collections in order to keep only the new data
                existingDirectAsset.getEffects().clear();
                this.directAssetRepository.save(existingDirectAsset);
            }
        }

        Set<IndirectAsset> effects = directAsset.getEffects();

        if (effects != null && !effects.isEmpty()) {
            effects.stream().forEach((indirectAsset) -> {
                indirectAsset.setDirectAsset(directAsset);
            });
        }

        DirectAsset result = directAssetRepository.save(directAsset);
        return result;
    }

    /**
     * Get all the directAssets.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<DirectAsset> findAll() {
        log.debug("Request to get all DirectAssets");
        return directAssetRepository.findAll();
    }

    /**
     * Get one directAsset by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public DirectAsset findOne(Long id) {
        log.debug("Request to get DirectAsset : {}", id);
        return directAssetRepository.findOne(id);
    }

    @Override
    public DirectAsset findOneByMyAssetID(Long selfAssessmentID, Long myAssetID) {
        log.debug("Request to get DirectAsset by SelfAssessment ID: {} and andMyAsset ID: {}", selfAssessmentID, myAssetID);
        return directAssetRepository.findOneByMyAssetID(selfAssessmentID, myAssetID);
    }

    /**
     * Delete the directAsset by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete DirectAsset : {}", id);
        directAssetRepository.delete(id);
    }

    @Override
    public List<DirectAsset> findAllBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get all DirectAssets");
        return directAssetRepository.findAllBySelfAssessment(selfAssessmentID);
    }
}
