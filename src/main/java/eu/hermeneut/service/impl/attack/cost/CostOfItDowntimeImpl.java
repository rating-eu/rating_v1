package eu.hermeneut.service.impl.attack.cost;

import eu.hermeneut.aop.annotation.CostQualifier;
import eu.hermeneut.config.ApplicationProperties;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.enumeration.AttackCostParamType;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.domain.formula.AttackCostFormula;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.AttackCostParamService;
import eu.hermeneut.service.attack.cost.AttackCostCalculator;
import eu.hermeneut.service.attack.cost.AttackCostCleaner;
import eu.hermeneut.service.formula.AttackCostFormulator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@CostQualifier(type = CostType.COST_OF_IT_DOWNTIME)
public class CostOfItDowntimeImpl implements AttackCostCalculator, AttackCostFormulator, AttackCostCleaner {

    @Autowired
    private AttackCostParamService attackCostParamService;

    @Autowired
    private ApplicationProperties properties;

    @Override
    public AttackCost calculate(@NotNull List<AttackCostParam> params) throws IllegalInputException {
        Map<AttackCostParamType, AttackCostParam> paramMap = params.stream().collect(Collectors.toMap(
            (param) -> param.getType(),
            Function.identity()
        ));

        this.checkParams(paramMap);

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
            .type(CostType.COST_OF_IT_DOWNTIME)
            .costs(new BigDecimal(employeeCostPerHour * fractionOfEmployeesAffectedByOutage +
                averageRevenuePerHour * fractionOfRevenueAffectedByOutage + recoveryCost));

        return attackCost;
    }

    private void checkParams(Map<AttackCostParamType, AttackCostParam> paramMap) throws IllegalInputException {
        if (!(paramMap.containsKey(AttackCostParamType.EMPLOYEE_COST_PER_HOUR)
            && paramMap.containsKey(AttackCostParamType.FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE)
            && paramMap.containsKey(AttackCostParamType.AVERAGE_REVENUE_PER_HOUR)
            && paramMap.containsKey(AttackCostParamType.FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE)
            && paramMap.containsKey(AttackCostParamType.RECOVERY_COST)

            && paramMap.get(AttackCostParamType.EMPLOYEE_COST_PER_HOUR).getValue() != null
            && paramMap.get(AttackCostParamType.FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE).getValue() != null
            && paramMap.get(AttackCostParamType.AVERAGE_REVENUE_PER_HOUR).getValue() != null
            && paramMap.get(AttackCostParamType.FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE).getValue() != null
            && paramMap.get(AttackCostParamType.RECOVERY_COST).getValue() != null)
        ) {
            throw new IllegalInputException("Missing params");
        }
    }

    @Override
    public AttackCostFormula formulate(List<AttackCostParam> params) throws IllegalInputException {
        Map<AttackCostParamType, AttackCostParam> paramMap = params.stream().collect(Collectors.toMap(
            (param) -> param.getType(),
            Function.identity()
        ));

        this.checkParams(paramMap);

        final AttackCostParam EMPLOYEE_COST_PER_HOUR = paramMap.get(AttackCostParamType.EMPLOYEE_COST_PER_HOUR);
        final AttackCostParam FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE = paramMap.get(AttackCostParamType.FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE);
        final AttackCostParam AVERAGE_REVENUE_PER_HOUR = paramMap.get(AttackCostParamType.AVERAGE_REVENUE_PER_HOUR);
        final AttackCostParam FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE = paramMap.get(AttackCostParamType.FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE);
        final AttackCostParam RECOVERY_COST = paramMap.get(AttackCostParamType.RECOVERY_COST);

        float employeeCostPerHour = EMPLOYEE_COST_PER_HOUR.getValue().floatValue();
        float fractionOfEmployeesAffectedByOutage = FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE.getValue().floatValue();
        float averageRevenuePerHour = AVERAGE_REVENUE_PER_HOUR.getValue().floatValue();
        float fractionOfRevenueAffectedByOutage = FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE.getValue().floatValue();
        float recoveryCost = RECOVERY_COST.getValue().floatValue();

        AttackCostFormula attackCostFormula = new AttackCostFormula();
        attackCostFormula.setAttackCost(this.calculate(params));
        attackCostFormula.setAttackCostParams(Arrays.asList(EMPLOYEE_COST_PER_HOUR, FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE, AVERAGE_REVENUE_PER_HOUR, RECOVERY_COST));

        StringBuilder formula = new StringBuilder();

        formula.append(AttackCostParamType.EMPLOYEE_COST_PER_HOUR.name());
        formula.append("(");
        formula.append(employeeCostPerHour);
        formula.append(this.properties.getCurrency() + ")");

        formula.append(" X ");

        formula.append(AttackCostParamType.FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE.name());
        formula.append("(");
        formula.append(fractionOfEmployeesAffectedByOutage);
        formula.append(")");

        formula.append(" + ");

        formula.append(AttackCostParamType.AVERAGE_REVENUE_PER_HOUR.name());
        formula.append("(");
        formula.append(averageRevenuePerHour);
        formula.append(this.properties.getCurrency() + ")");

        formula.append(" X ");

        formula.append(AttackCostParamType.FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE.name());
        formula.append("(");
        formula.append(fractionOfRevenueAffectedByOutage);
        formula.append(")");

        formula.append(" + ");

        formula.append(AttackCostParamType.RECOVERY_COST.name());
        formula.append("(");
        formula.append(recoveryCost);
        formula.append(this.properties.getCurrency() + ")");

        formula.append(" = ");
        formula.append(attackCostFormula.getAttackCost().getCosts());
        formula.append(this.properties.getCurrency());

        attackCostFormula.setFormula(formula.toString());

        return attackCostFormula;
    }

    @Override
    public void clean(SelfAssessment selfAssessment) {
        try {
            List<AttackCostParam> attackCostParams = this.attackCostParamService.findAllBySelfAssessment(selfAssessment.getId());

            if (attackCostParams != null && !attackCostParams.isEmpty()) {
                Map<AttackCostParamType, AttackCostParam> attackCostParamsMap = attackCostParams.stream().parallel().collect(
                    Collectors.toMap(
                        attackCostParam -> attackCostParam.getType(),
                        Function.identity())
                );

                if (attackCostParamsMap != null && !attackCostParamsMap.isEmpty()) {
                    final AttackCostParam EMPLOYEE_COST_PER_HOUR = attackCostParamsMap.get(AttackCostParamType.EMPLOYEE_COST_PER_HOUR);

                    //It may have id=null if simultaneously deleted somewhere else
                    if (EMPLOYEE_COST_PER_HOUR != null && EMPLOYEE_COST_PER_HOUR.getId() != null) {
                        this.attackCostParamService.delete(EMPLOYEE_COST_PER_HOUR.getId());
                    }

                    final AttackCostParam FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE = attackCostParamsMap.get(AttackCostParamType.FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE);

                    //It may have id=null if simultaneously deleted somewhere else
                    if (FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE != null && FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE.getId() != null) {
                        this.attackCostParamService.delete(FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE.getId());
                    }

                    final AttackCostParam AVERAGE_REVENUE_PER_HOUR = attackCostParamsMap.get(AttackCostParamType.AVERAGE_REVENUE_PER_HOUR);

                    //It may have id=null if simultaneously deleted somewhere else
                    if (AVERAGE_REVENUE_PER_HOUR != null && AVERAGE_REVENUE_PER_HOUR.getId() != null) {
                        this.attackCostParamService.delete(AVERAGE_REVENUE_PER_HOUR.getId());
                    }

                    final AttackCostParam FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE = attackCostParamsMap.get(AttackCostParamType.FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE);

                    //It may have id=null if simultaneously deleted somewhere else
                    if (FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE != null && FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE.getId() != null) {
                        this.attackCostParamService.delete(FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE.getId());
                    }

                    final AttackCostParam RECOVERY_COST = attackCostParamsMap.get(AttackCostParamType.RECOVERY_COST);

                    //It may have id=null if simultaneously deleted somewhere else
                    if (RECOVERY_COST != null && RECOVERY_COST.getId() != null) {
                        this.attackCostParamService.delete(RECOVERY_COST.getId());
                    }
                }
            }
        } catch (NotFoundException e) {
            e.printStackTrace();
        }
    }
}
