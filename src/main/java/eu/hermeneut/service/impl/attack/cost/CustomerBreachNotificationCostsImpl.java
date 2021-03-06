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
@CostQualifier(type = CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS)
public class CustomerBreachNotificationCostsImpl implements AttackCostCalculator, AttackCostFormulator, AttackCostCleaner {

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

        final AttackCostParam NUMBER_OF_CUSTOMERS = paramMap.get(AttackCostParamType.NUMBER_OF_CUSTOMERS);
        final AttackCostParam NOTIFICATION_COST_PER_CUSTOMER = paramMap.get(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER);

        //Update (id != null) or create (id = null) new params.
        this.attackCostParamService.save(NUMBER_OF_CUSTOMERS);
        this.attackCostParamService.save(NOTIFICATION_COST_PER_CUSTOMER);

        int customers = NUMBER_OF_CUSTOMERS.getValue().intValue();
        float notificationCost = NOTIFICATION_COST_PER_CUSTOMER.getValue().floatValue();

        AttackCost attackCost = new AttackCost()
            .type(CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS)
            .costs(new BigDecimal(customers * notificationCost));

        return attackCost;
    }

    private void checkParams(Map<AttackCostParamType, AttackCostParam> paramMap) throws IllegalInputException {
        if (!(paramMap.containsKey(AttackCostParamType.NUMBER_OF_CUSTOMERS)
            && paramMap.containsKey(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER)
            && paramMap.get(AttackCostParamType.NUMBER_OF_CUSTOMERS).getValue() != null
            && paramMap.get(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER).getValue() != null
        )) {
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

        final AttackCostParam NUMBER_OF_CUSTOMERS = paramMap.get(AttackCostParamType.NUMBER_OF_CUSTOMERS);
        final AttackCostParam NOTIFICATION_COST_PER_CUSTOMER = paramMap.get(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER);

        int customers = NUMBER_OF_CUSTOMERS.getValue().intValue();
        float notificationCost = NOTIFICATION_COST_PER_CUSTOMER.getValue().floatValue();

        AttackCostFormula attackCostFormula = new AttackCostFormula();
        attackCostFormula.setAttackCost(this.calculate(params));
        attackCostFormula.setAttackCostParams(Arrays.asList(NUMBER_OF_CUSTOMERS, NOTIFICATION_COST_PER_CUSTOMER));

        StringBuilder formula = new StringBuilder();

        formula.append(AttackCostParamType.NUMBER_OF_CUSTOMERS.name());
        formula.append("(");
        formula.append(customers);
        formula.append(")");

        formula.append(" X ");

        formula.append(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER.name());
        formula.append("(");
        formula.append(notificationCost);
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
                    final AttackCostParam NOTIFICATION_COST_PER_CUSTOMER = attackCostParamsMap.get(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER);

                    //It may have id=null if simultaneously deleted somewhere else
                    if (NOTIFICATION_COST_PER_CUSTOMER != null && NOTIFICATION_COST_PER_CUSTOMER.getId() != null) {
                        this.attackCostParamService.delete(NOTIFICATION_COST_PER_CUSTOMER.getId());
                    }
                }
            }
        } catch (NotFoundException e) {
            e.printStackTrace();
        }
    }
}
