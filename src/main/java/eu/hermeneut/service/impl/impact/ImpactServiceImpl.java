package eu.hermeneut.service.impl.impact;

import eu.hermeneut.domain.*;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.impact.ImpactService;
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

                BigDecimal lossValue = myAsset.getLossValue();

                if (lossValue != null) {// Check if MyAsset has a LossValue set
                    economicImpact.add(lossValue);
                }

                Set<AttackCost> directCosts = myAsset.getCosts();

                this.sumAttackCosts(economicImpact, directCosts);

                DirectAsset directAsset = this.directAssetService.findOneByMyAssetID(selfAssessmentID, myAssetID);

                if (directAsset != null) {//If it is a DIRECT asset, sum also the costs of the indirects
                    Set<IndirectAsset> indirectAssets = directAsset.getEffects();

                    if (indirectAssets != null && !indirectAssets.isEmpty()) {
                        indirectAssets.stream().forEach((indirect) -> {
                            Set<AttackCost> indirectCosts = indirect.getMyAsset().getCosts();

                            this.sumAttackCosts(economicImpact, indirectCosts);
                        });
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
                    impactLevels.stream().forEach((impactLevel) -> {
                        //A > B ---> 1
                        //A == B ---> 0
                        //A < B ---> -1
                        if (economicImpact.compareTo(impactLevel.getMinLoss()) >= 0 &&
                            economicImpact.compareTo((impactLevel.getMaxLoss())) <= 0) {

                            myAsset.setImpact(impactLevel.getImpact());
                        }
                    });
                }

                return this.myAssetService.save(myAsset);
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
     * @param economicImpact
     * @param attackCosts
     */
    private void sumAttackCosts(BigDecimal economicImpact, Set<AttackCost> attackCosts) {
        if (economicImpact != null && attackCosts != null && !attackCosts.isEmpty()) {
            attackCosts.stream().forEach((attackCost) -> {
                BigDecimal costValue = attackCost.getCosts();

                if (costValue != null) {
                    economicImpact.add(costValue);
                }
            });
        }
    }
}
