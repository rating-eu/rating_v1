package eu.hermeneut.web.rest.formula;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.DirectAsset;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.domain.formula.AttackCostFormula;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.DirectAssetService;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.formula.AttackCostFormulatorSwitch;
import eu.hermeneut.service.formula.ImpactFormulator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class FormulaController {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private DirectAssetService directAssetService;

    @Autowired
    private AttackCostFormulatorSwitch attackCostFormulatorSwitch;

    @Autowired
    private ImpactFormulator impactFormulator;

    @GetMapping("/{selfAssessmentID}/formula/attack-costs/{myAssetID}")
    @Timed
    public List<AttackCostFormula> getAttackCostsFormulaByMyAsset(@PathVariable Long selfAssessmentID, @PathVariable Long myAssetID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        MyAsset myAsset = this.myAssetService.findOne(myAssetID);
        this.checkIfNotFound(selfAssessment, myAsset);

        Set<AttackCost> directCosts = myAsset.getCosts();

        Map<CostType, AttackCostFormula> costTypeFormulaMap = new HashMap<>();

        if (directCosts != null && !directCosts.isEmpty()) {
            for (AttackCost directCost : directCosts) {
                try {
                    final AttackCostFormula attackCostFormula = attackCostFormulatorSwitch.formulateCost(selfAssessmentID, directCost);
                    attackCostFormula.setDirect(true);

                    costTypeFormulaMap.put(directCost.getType(), attackCostFormula);
                } catch (IllegalInputException e) {
                    e.printStackTrace();
                }
            }
        }

        DirectAsset directAsset = this.directAssetService.findOneByMyAssetID(selfAssessmentID, myAssetID);

        if (directAsset != null) {
            Set<AttackCost> indirectCosts = directAsset.getMyAsset().getCosts();

            if (indirectCosts != null && !indirectCosts.isEmpty()) {
                for (AttackCost indirectCost : indirectCosts) {

                    //Check if the same type has been identified also as direct
                    if (!costTypeFormulaMap.containsKey(indirectCost.getType())) {
                        try {
                            final AttackCostFormula attackCostFormula = attackCostFormulatorSwitch.formulateCost(selfAssessmentID, indirectCost);
                            attackCostFormula.setDirect(false);

                            costTypeFormulaMap.put(indirectCost.getType(), attackCostFormula);
                        } catch (IllegalInputException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }

        return costTypeFormulaMap.values().stream().collect(Collectors.toList());
    }

    @GetMapping("/{selfAssessmentID}/formula/impact/{myAssetID}")
    @Timed
    public String getImpactFormulaByMyAsset(@PathVariable Long selfAssessmentID, @PathVariable Long myAssetID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        MyAsset myAsset = this.myAssetService.findOne(myAssetID);
        this.checkIfNotFound(selfAssessment, myAsset);

        return this.impactFormulator.formulateImpact(selfAssessmentID, myAssetID);
    }

    private void checkIfNotFound(SelfAssessment selfAssessment, MyAsset myAsset) throws NotFoundException {
        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment not found!!!");
        }

        if (myAsset == null) {
            throw new NotFoundException("MyAsset not found!!!");
        }
    }
}
