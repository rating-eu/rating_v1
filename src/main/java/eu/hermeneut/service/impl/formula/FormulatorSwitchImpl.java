package eu.hermeneut.service.impl.formula;

import eu.hermeneut.aop.annotation.CostQualifier;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.domain.formula.AttackCostFormula;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.AttackCostParamService;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.formula.AttackCostFormulator;
import eu.hermeneut.service.formula.FormulatorSwitch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.util.List;

@Service
@Transactional
public class FormulatorSwitchImpl implements FormulatorSwitch {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private AttackCostService attackCostService;

    @Autowired
    @CostQualifier(type = CostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS)
    private AttackCostFormulator postBreachCustomerProtection;

    @Autowired
    @CostQualifier(type = CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS)
    private AttackCostFormulator customerBreachNotificationCosts;

    @Autowired
    @CostQualifier(type = CostType.COST_OF_IT_DOWNTIME)
    private AttackCostFormulator costOfITDowntime;

    @Autowired
    private AttackCostParamService attackCostParamService;

    @Override
    public AttackCostFormula formulateCost(@NotNull Long selfAssessmentID, @NotNull AttackCost attackCost) throws NotFoundException, IllegalInputException {
        List<AttackCostParam> params = this.attackCostParamService.findAllBySelfAssessment(selfAssessmentID);

        switch (attackCost.getType()) {
            case POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS: {
                AttackCostFormula formula = this.postBreachCustomerProtection.formulate(params);
                return formula;
            }
            case CUSTOMER_BREACH_NOTIFICATION_COSTS: {
                AttackCostFormula formula = this.customerBreachNotificationCosts.formulate(params);
                return formula;
            }
            case COST_OF_IT_DOWNTIME: {
                AttackCostFormula formula = this.costOfITDowntime.formulate(params);
                return formula;
            }
            default: {
                AttackCostFormula formula = new AttackCostFormula();
                formula.setAttackCost(attackCost);
                formula.setAttackCostParams(null);
                formula.setFormula(null);

                return formula;
            }
        }
    }
}
