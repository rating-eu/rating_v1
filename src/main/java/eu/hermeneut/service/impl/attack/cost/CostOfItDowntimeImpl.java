package eu.hermeneut.service.impl.attack.cost;

import eu.hermeneut.aop.annotation.CostQualifier;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.enumeration.AttackCostParamType;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.service.AttackCostParamService;
import eu.hermeneut.service.attack.cost.AttackCostCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@CostQualifier(type = CostType.COST_OF_IT_DOWNTIME)
public class CostOfItDowntimeImpl implements AttackCostCalculator {

    @Autowired
    private AttackCostParamService attackCostParamService;

    @Override
    public AttackCost calculate(@NotNull List<AttackCostParam> params) throws IllegalInputException {
        Map<AttackCostParamType, AttackCostParam> paramMap = params.stream().collect(Collectors.toMap(
            (param) -> param.getType(),
            Function.identity()
        ));

        if (paramMap.containsKey(AttackCostParamType.EMPLOYEE_COST_PER_HOUR)
            && paramMap.containsKey(AttackCostParamType.FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE)
            && paramMap.containsKey(AttackCostParamType.AVERAGE_REVENUE_PER_HOUR)
            && paramMap.containsKey(AttackCostParamType.FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE)
            && paramMap.containsKey(AttackCostParamType.RECOVERY_COST)

            && paramMap.get(AttackCostParamType.EMPLOYEE_COST_PER_HOUR).getValue() != null
            && paramMap.get(AttackCostParamType.FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE).getValue() != null
            && paramMap.get(AttackCostParamType.AVERAGE_REVENUE_PER_HOUR).getValue() != null
            && paramMap.get(AttackCostParamType.FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE).getValue() != null
            && paramMap.get(AttackCostParamType.RECOVERY_COST).getValue() != null
        ) {

            final AttackCostParam EMPLOYEE_COST_PER_HOUR = paramMap.get(AttackCostParamType.EMPLOYEE_COST_PER_HOUR);
            final AttackCostParam FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE = paramMap.get(AttackCostParamType.FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE);
            final AttackCostParam AVERAGE_REVENUE_PER_HOUR = paramMap.get(AttackCostParamType.AVERAGE_REVENUE_PER_HOUR);
            final AttackCostParam FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE = paramMap.get(AttackCostParamType.FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE);
            final AttackCostParam RECOVERY_COST = paramMap.get(AttackCostParamType.RECOVERY_COST);

            //Update (id != null) or create (id = null) new params.
            this.attackCostParamService.save(EMPLOYEE_COST_PER_HOUR);
            this.attackCostParamService.save(FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE);
            this.attackCostParamService.save(AVERAGE_REVENUE_PER_HOUR);
            this.attackCostParamService.save(FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE);
            this.attackCostParamService.save(RECOVERY_COST);

            float employeeCostPerHour = EMPLOYEE_COST_PER_HOUR.getValue().floatValue();
            float fractionOfEmployeesAffectedByOutage = FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE.getValue().floatValue();
            float averageRevenuePerHour = AVERAGE_REVENUE_PER_HOUR.getValue().floatValue();
            float fractionOfRevenueAffectedByOutage = FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE.getValue().floatValue();
            float recoveryCost = RECOVERY_COST.getValue().floatValue();

            AttackCost attackCost = new AttackCost()
                .type(CostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS)
                .costs(new BigDecimal(employeeCostPerHour * fractionOfEmployeesAffectedByOutage +
                    averageRevenuePerHour * fractionOfRevenueAffectedByOutage + recoveryCost));

            return attackCost;
        } else {
            throw new IllegalInputException("Missing params");
        }
    }
}
