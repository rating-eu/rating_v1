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

package eu.hermeneut.service.impl.impact;

import eu.hermeneut.config.ApplicationProperties;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.impact.ImpactService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.*;

@Service
@Transactional
public class ImpactServiceImpl implements ImpactService {

    public static final int HIGHEST_IMPACT = 5;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private DirectAssetService directAssetService;

    @Autowired
    private ImpactLevelService impactLevelService;

    private Logger logger = LoggerFactory.getLogger(ImpactServiceImpl.class);

    @Autowired
    private ApplicationProperties properties;

    @Override
    public List<MyAsset> calculateEconomicImpacts(@NotNull Long selfAssessmentID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        //Check if the SelfAssessment exists
        if (selfAssessment != null) {
            List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);
            List<MyAsset> impactsResult = new ArrayList<>();

            //Check if MyAssets have been identified
            if (myAssets != null && !myAssets.isEmpty()) {
                myAssets.stream().forEach((myAsset) -> {
                    try {
                        myAsset = this.calculateEconomicImpact(selfAssessmentID, myAsset.getId());
                        impactsResult.add(myAsset);
                    } catch (NotFoundException e) {
                        e.printStackTrace();
                    }
                });

                return impactsResult;
            } else {
                throw new NotFoundException("MyAssets NOT FOUND!");
            }
        } else {
            throw new NotFoundException("SelfAssessment NOT FOUND!");
        }
    }

    @Override
    public MyAsset calculateEconomicImpact(Long selfAssessmentID, Long myAssetID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        MyAsset myAsset = this.myAssetService.findOne(myAssetID);

        if (selfAssessment != null) {//Check if the SelfAssessment exists

            if (myAsset != null) { //Check if MyAsset exists
                BigDecimal economicImpact = BigDecimal.ZERO;
                logger.debug("EconomicImpact: " + economicImpact);

                BigDecimal lossValue = myAsset.getLossValue();
                logger.debug("LossValue: " + lossValue);

                if (lossValue != null) {// Check if MyAsset has a LossValue set
                    economicImpact = economicImpact.add(lossValue);
                    logger.debug("EconomicImpact: " + economicImpact);
                }

                DirectAsset directAsset = this.directAssetService.findOneByMyAssetID(selfAssessment.getId(), myAsset.getId());

                if (directAsset != null) {//If it is a DIRECT asset, sum also the losses of the indirects
                    Set<IndirectAsset> indirectAssets = directAsset.getEffects();

                    if (indirectAssets != null && !indirectAssets.isEmpty()) {
                        for (IndirectAsset indirect : indirectAssets) {
                            BigDecimal indirectLossValue = indirect.getMyAsset().getLossValue();

                            if (indirectLossValue != null) {//Add the indirect loss
                                economicImpact = economicImpact.add(indirectLossValue);
                            }
                        }
                    }
                }

                logger.debug("EconomicImpact after IndirecLosses: " + economicImpact);

                //Map to avoid duplicated CostTypes
                Map<CostType, AttackCost> uniqueCostTypes = toUniqueCostTypes(selfAssessment, myAsset);

                for (AttackCost uniqueCost : uniqueCostTypes.values()) {
                    if (uniqueCost != null && uniqueCost.getCosts() != null) {
                        economicImpact = economicImpact.add(uniqueCost.getCosts());
                    }
                }

                myAsset.setEconomicImpact(economicImpact);

                List<ImpactLevel> impactLevels = this.impactLevelService.findAllBySelfAssessment(selfAssessmentID);

                if (impactLevels != null && !impactLevels.isEmpty()) {
                    boolean outOfBounds = true;

                    for (ImpactLevel impactLevel : impactLevels) {
                        logger.debug("EconomicImpact: " + myAsset.getEconomicImpact());
                        logger.debug("Impact: " + impactLevel.getImpact());
                        logger.debug("Min: " + impactLevel.getMinLoss());
                        logger.debug("Max: " + impactLevel.getMaxLoss());
                        //A > B ---> 1
                        //A == B ---> 0
                        //A < B ---> -1
                        if (economicImpact.compareTo(impactLevel.getMinLoss()) >= 0 &&
                            economicImpact.compareTo((impactLevel.getMaxLoss())) <= 0) {
                            outOfBounds = false;

                            myAsset.setImpact(impactLevel.getImpact());
                            logger.debug("NEW IMPACT: " + myAsset.getImpact());
                        }
                    }

                    if (outOfBounds) {
                        myAsset.setImpact(HIGHEST_IMPACT);
                    }
                }

                MyAsset result = this.myAssetService.save(myAsset);
                logger.debug("MyAsset.EconomicImpact: " + myAsset.getEconomicImpact());
                return result;
            } else {
                throw new NotFoundException("MyAsset NOT FOUND!");
            }
        } else {
            throw new NotFoundException("SelfAssessment NOT FOUND!");
        }
    }

    @Override
    public String formulateImpact(Long selfAssessmentID, Long myAssetID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment NOT FOUND!");
        }

        MyAsset myAsset = this.myAssetService.findOne(myAssetID);

        if (myAsset == null) {
            throw new NotFoundException("MyAsset NOT FOUND!");
        }

        myAsset = this.calculateEconomicImpact(selfAssessmentID, myAssetID);

        //Map to avoid duplicated CostTypes
        Map<CostType, AttackCost> uniqueCostTypes = toUniqueCostTypes(selfAssessment, myAsset);

        StringBuilder formula = new StringBuilder();

        BigDecimal lossValue = myAsset.getLossValue() != null ? myAsset.getLossValue() : BigDecimal.ZERO;

        formula.append("LOSS_VALUE(");
        formula.append(lossValue);
        formula.append(this.properties.getCurrency() + ")");

        DirectAsset directAsset = this.directAssetService.findOneByMyAssetID(selfAssessment.getId(), myAsset.getId());

        if (directAsset != null) {//If it is a DIRECT asset, sum also the losses of the indirects
            Set<IndirectAsset> indirectAssets = directAsset.getEffects();

            if (indirectAssets != null && !indirectAssets.isEmpty()) {
                for (IndirectAsset indirect : indirectAssets) {
                    BigDecimal indirectLossValue = indirect.getMyAsset().getLossValue();

                    if (indirectLossValue != null) {//Add the indirect loss
                        formula.append(" + ");
                        formula.append(indirect.getMyAsset().getAsset().getName() + "." + "LOSS_VALUE(");
                        formula.append(indirectLossValue);
                        formula.append(this.properties.getCurrency() + ")");
                    }
                }
            }
        }

        for (AttackCost attackCost : uniqueCostTypes.values()) {
            if (attackCost != null && attackCost.getCosts() != null) {
                formula.append(" + ");
                formula.append(attackCost.getType().name());
                formula.append("(");
                formula.append(attackCost.getCosts());
                formula.append(this.properties.getCurrency() + ")");
            }
        }

        formula.append(" = ");
        formula.append(myAsset.getEconomicImpact());
        formula.append(this.properties.getCurrency());

        return formula.toString();
    }

    private Map<CostType, AttackCost> toUniqueCostTypes(SelfAssessment selfAssessment, MyAsset myAsset) {
        //Map to avoid duplicated CostTypes
        Map<CostType, AttackCost> uniqueCostTypes = new HashMap<>();

        Set<AttackCost> directCosts = myAsset.getCosts();

        if (directCosts != null && !directCosts.isEmpty()) {
            //Add direct costs
            for (AttackCost directCost : directCosts) {
                uniqueCostTypes.put(directCost.getType(), directCost);
            }
        }

        DirectAsset directAsset = this.directAssetService.findOneByMyAssetID(selfAssessment.getId(), myAsset.getId());

        if (directAsset != null) {//If it is a DIRECT asset, sum also the costs of the indirects
            Set<IndirectAsset> indirectAssets = directAsset.getEffects();

            if (indirectAssets != null && !indirectAssets.isEmpty()) {
                for (IndirectAsset indirect : indirectAssets) {
                    Set<AttackCost> indirectCosts = indirect.getMyAsset().getCosts();

                    if (indirectCosts != null && !indirectCosts.isEmpty()) {
                        //Add indirect costs
                        for (AttackCost indirectCost : indirectCosts) {
                            uniqueCostTypes.put(indirectCost.getType(), indirectCost);
                        }
                    }
                }
            }
        }

        return uniqueCostTypes;
    }
}
