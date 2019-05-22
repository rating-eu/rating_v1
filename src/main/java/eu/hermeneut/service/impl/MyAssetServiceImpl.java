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

import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.enumeration.AssetType;
import eu.hermeneut.domain.enumeration.CategoryType;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NotImplementedYetException;
import eu.hermeneut.service.AttackCostParamService;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.repository.MyAssetRepository;
import eu.hermeneut.service.attack.cost.AttackCostSwitch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing MyAsset.
 */
@Service
@Transactional
public class MyAssetServiceImpl implements MyAssetService {

    private final Logger log = LoggerFactory.getLogger(MyAssetServiceImpl.class);

    private final MyAssetRepository myAssetRepository;


    @Autowired
    private AttackCostService attackCostService;

    @Autowired
    private AttackCostParamService attackCostParamService;

    @Autowired
    private AttackCostSwitch attackCostSwitch;

    public MyAssetServiceImpl(MyAssetRepository myAssetRepository) {
        this.myAssetRepository = myAssetRepository;
    }


    /**
     * Save a myAsset.
     *
     * @param myAsset the entity to save
     * @return the persisted entity
     */
    @Override
    public MyAsset save(MyAsset myAsset) {
        log.debug("Request to save MyAsset : {}", myAsset);

        if (myAsset.getId() != null) {
            MyAsset existingMyAsset = this.myAssetRepository.findOne(myAsset.getId());

            if (existingMyAsset != null) {
                Map<Long, AttackCost> existingCostsByID = existingMyAsset.getCosts().stream()
                    .collect(Collectors.toMap(o -> o.getId(), Function.identity()));

                // ConfirmedCosts (id != null)
                Map<Long, AttackCost> confirmedCostsByID = myAsset.getCosts().stream()
                    .filter((attackCost) -> attackCost.getId() != null)
                    .collect(Collectors.toMap(o -> o.getId(), Function.identity()));

                //Deleted costs
                Map<Long, AttackCost> deletedCostsByID = existingCostsByID.values().stream()
                    .filter((attackCost -> !confirmedCostsByID.containsKey(attackCost.getId())))
                    .collect(Collectors.toMap(o -> o.getId(), Function.identity()));

                // Delete the costs not present anymore.
                deletedCostsByID.values().stream().forEach((attackCost) -> {
                    this.attackCostService.delete(attackCost.getId());
                });
            }
        }

        if (myAsset.getCosts() != null && !myAsset.getCosts().isEmpty()) {
            myAsset.getCosts().stream().forEach((attackCost) -> {
                attackCost.setMyAsset(myAsset);
            });
        }

        MyAsset result = myAssetRepository.save(myAsset);

        if (result != null) {
            Set<AttackCost> costs = result.getCosts();
            Long selfID = result.getSelfAssessment().getId();

            if (costs != null) {
                try {
                    List<AttackCostParam> attackCostParams = this.attackCostParamService.findAllBySelfAssessment(selfID);

                    if (attackCostParams != null && !attackCostParams.isEmpty()) {
                        for (AttackCost cost : costs) {
                            try {
                                //Updates siblings too.
                                this.attackCostSwitch.calculateCost(selfID, cost.getType(), attackCostParams);
                            } catch (IllegalInputException e) {
                                e.printStackTrace();
                            } catch (NotImplementedYetException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                } catch (NotFoundException e) {
                    e.printStackTrace();
                }
            }
        }

        return result;
    }

    @Override
    public List<MyAsset> saveAll(List<MyAsset> myAssets) {
        log.debug("Request to save all MyAssets : {}", Arrays.toString(myAssets.toArray()));

        myAssets.stream().filter((myAsset) -> myAsset.getCosts() != null && !myAsset.getCosts().isEmpty()).forEach(
            (myAsset) -> {
                myAsset.getCosts().forEach((attackCost) -> {
                    attackCost.setMyAsset(myAsset);
                });
            }
        );

        List<MyAsset> result = myAssetRepository.save(myAssets);
        return result;
    }

    /**
     * Get all the myAssets.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<MyAsset> findAll() {
        log.debug("Request to get all MyAssets");
        return myAssetRepository.findAll();
    }

    /**
     * Get one myAsset by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public MyAsset findOne(Long id) {
        log.debug("Request to get MyAsset : {}", id);
        return myAssetRepository.findOne(id);
    }

    @Override
    public MyAsset findOneByIDAndSelfAssessment(Long myAssetID, Long selfAssessmentID) {
        log.debug("Request to get MyAsset by ID: {} and SelfAssessment: {}", myAssetID, selfAssessmentID);
        return myAssetRepository.findOneByIDAndSelfAssessment(myAssetID, selfAssessmentID);
    }

    /**
     * Delete the myAsset by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete MyAsset : {}", id);
        myAssetRepository.delete(id);
    }

    @Override
    public List<MyAsset> findAllBySelfAssessment(Long selfAssessmentID) {
        log.debug("Request to get all MyAssets by SelfAssessment ID");
        return myAssetRepository.findAllBySelfAssessment(selfAssessmentID);
    }

    @Override
    public List<MyAsset> findAllBySelfAssessmentAndAssetType(Long selfAssessmentID, AssetType assetType) {
        log.debug("Request to get all MyAssets by SelfAssessment ID and AssetType: " + assetType);
        return this.myAssetRepository.findAllBySelfAssessmentAndAssetType(selfAssessmentID, assetType);
    }

    @Override
    public List<MyAsset> findAllBySelfAssessmentAndCategoryType(Long selfAssessmentID, CategoryType categoryType) throws NotImplementedYetException {
        log.debug("Request to get all MyAssets by SelfAssessment ID and CategoryType: " + categoryType);

        switch (categoryType) {
            case DATA: {
                //TODO think about a better way to search by Category instead of Strings.
                return this.myAssetRepository.findAllBySelfAssessmentAndAssetCategory(selfAssessmentID, "Data");
            }
            case IP:
            case KEY_COMP:
            case ORG_CAPITAL:
            default: {
                throw new NotImplementedYetException("Method not implemented for this CategoryType");
            }
        }
    }

    @Override
    public List<MyAsset> findAllBySelfAssessmentAndAssetCategory(Long selfAssessmentID, String categoryName) {

        return this.myAssetRepository.findAllBySelfAssessmentAndAssetCategory(selfAssessmentID, categoryName);
    }
}
