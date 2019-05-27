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

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.domain.enumeration.SectorType;
import eu.hermeneut.exceptions.NotImplementedYetException;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.SplittingLossService;
import eu.hermeneut.domain.SplittingLoss;
import eu.hermeneut.repository.SplittingLossRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;


/**
 * Service Implementation for managing SplittingLoss.
 */
@Service
@Transactional
public class SplittingLossServiceImpl implements SplittingLossService {

    private final Logger log = LoggerFactory.getLogger(SplittingLossServiceImpl.class);

    private final SplittingLossRepository splittingLossRepository;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    public SplittingLossServiceImpl(SplittingLossRepository splittingLossRepository) {
        this.splittingLossRepository = splittingLossRepository;
    }

    /**
     * Save a splittingLoss.
     *
     * @param splittingLoss the entity to save
     * @return the persisted entity
     */
    @Override
    public SplittingLoss save(SplittingLoss splittingLoss) {
        log.debug("Request to save SplittingLoss : {}", splittingLoss);
        SplittingLoss result = splittingLossRepository.save(splittingLoss);
        return result;
    }

    @Override
    public List<SplittingLoss> save(List<SplittingLoss> splittingLosses) {
        log.debug("Request to save SplittingLosses : {}", splittingLosses.size());
        List<SplittingLoss> result = splittingLossRepository.save(splittingLosses);
        return result;
    }

    /**
     * Get all the splittingLosses.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<SplittingLoss> findAll() {
        log.debug("Request to get all SplittingLosses");
        return splittingLossRepository.findAll();
    }

    /**
     * Get one splittingLoss by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public SplittingLoss findOne(Long id) {
        log.debug("Request to get SplittingLoss : {}", id);
        return splittingLossRepository.findOne(id);
    }

    /**
     * Delete the splittingLoss by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete SplittingLoss : {}", id);
        splittingLossRepository.delete(id);
    }

    public void delete(List<SplittingLoss> splittingLosses) {
        log.debug("Request to delete SplittingLosses : {}", splittingLosses);
        splittingLossRepository.delete(splittingLosses);
    }

    @Override
    public List<SplittingLoss> findAllBySelfAssessmentID(Long selfAssessmentID) {
        log.debug("Request to get all SplittingLosses by SelfAssessment ID: " + selfAssessmentID);
        return splittingLossRepository.findAllBySelfAssessmentID(selfAssessmentID);
    }

    @Override
    public SplittingLoss getDATASplittingLossBySelfAssessmentID(Long selfAssessmentID) {
        log.debug("Request to get DATA SplittingLoss by SelfAssessment ID: " + selfAssessmentID);
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        
        if (selfAssessment != null) {
            try {
                List<MyAsset> dataAssets = this.myAssetService.findAllBySelfAssessmentAndCategoryType(selfAssessmentID, CategoryType.DATA);

                if (dataAssets != null && !dataAssets.isEmpty()) {
                    SplittingLoss dataSplittingLoss = new SplittingLoss();
                    dataSplittingLoss.setId(null);
                    dataSplittingLoss.setSelfAssessment(selfAssessment);
                    dataSplittingLoss.setCategoryType(CategoryType.DATA);
                    dataSplittingLoss.setSectorType(SectorType.GLOBAL);

                    dataSplittingLoss.setLossPercentage(BigDecimal.ZERO);

                    BigDecimal lossValue = dataAssets.stream().map(myAsset -> myAsset.getLossValue() != null ? myAsset.getLossValue() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);

                    dataSplittingLoss.setLoss(lossValue);

                    return dataSplittingLoss;
                } else {
                    return null;
                }
            } catch (NotImplementedYetException e) {
                e.printStackTrace();
                return null;
            }
        }

        return null;
    }
}
