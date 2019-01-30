package eu.hermeneut.service.impl.impact;

import eu.hermeneut.domain.*;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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
    private IndirectAssetService indirectAssetService;

    @Autowired
    private AttackCostService attackCostService;

    @Autowired
    private ImpactLevelService impactLevelService;

    private Logger logger = LoggerFactory.getLogger(ImpactServiceImpl.class);

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
                        MyAsset myAssetResult = this.calculateEconomicImpact(selfAssessmentID, myAsset.getId());
                        impactsResult.add(myAssetResult);
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

                Set<AttackCost> directCosts = myAsset.getCosts();
                logger.debug("DirectCosts size: " + directCosts.size());

                economicImpact = economicImpact.add(this.sumAttackCosts(directCosts));
                logger.debug("DIRECT EconomicImpact: " + economicImpact);

                DirectAsset directAsset = this.directAssetService.findOneByMyAssetID(selfAssessmentID, myAssetID);
                logger.debug("DIRECT ASSET: " + directAsset);

                if (directAsset != null) {//If it is a DIRECT asset, sum also the costs of the indirects
                    Set<IndirectAsset> indirectAssets = directAsset.getEffects();
                    logger.debug("INDIRECT ASSETS: " + indirectAssets.size());

                    if (indirectAssets != null && !indirectAssets.isEmpty()) {
                        for (IndirectAsset indirect : indirectAssets) {
                            Set<AttackCost> indirectCosts = indirect.getMyAsset().getCosts();
                            logger.debug("INDIRECT COSTS size: " + indirectCosts.size());

                            economicImpact = economicImpact.add(this.sumAttackCosts(indirectCosts));
                            logger.debug("FOR EconomicImpact: " + economicImpact);
                        }
                    }
                } else {
                    /*
                    DO NOTHING
                    If it is an INDIRECT ASSET we have already summed the loss value and te attack costs.
                     */
                }

                myAsset.setEconomicImpact(economicImpact);

                List<ImpactLevel> impactLevels = this.impactLevelService.findAllBySelfAssessment(selfAssessmentID);

                if (impactLevels != null && !impactLevels.isEmpty()) {
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

                            myAsset.setImpact(impactLevel.getImpact());
                            logger.debug("NEW IMPACT: " + myAsset.getImpact());
                        }
                    }

                    if (myAsset.getImpact() == null) {
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

    /**
     * Sum the value of the AttackCosts to the EconomicImpact total.
     *
     * @param attackCosts
     */
    private BigDecimal sumAttackCosts(Set<AttackCost> attackCosts) {
        BigDecimal result = BigDecimal.ZERO;

        if (attackCosts != null && !attackCosts.isEmpty()) {
            for (AttackCost attackCost : attackCosts) {
                BigDecimal costValue = attackCost.getCosts();
                logger.debug("COST VALUE: " + costValue);

                if (costValue != null) {
                    result = result.add(costValue);
                    logger.debug("RESULT: " + result);
                }
            }
        }

        return result;
    }
}
