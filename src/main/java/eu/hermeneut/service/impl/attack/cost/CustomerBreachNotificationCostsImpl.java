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
@CostQualifier(type = CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS)
public class CustomerBreachNotificationCostsImpl implements AttackCostCalculator {

    @Autowired
    private AttackCostParamService attackCostParamService;

    @Override
    public AttackCost calculate(@NotNull List<AttackCostParam> params) throws IllegalInputException {
        Map<AttackCostParamType, AttackCostParam> paramMap = params.stream().collect(Collectors.toMap(
            (param) -> param.getType(),
            Function.identity()
        ));

        if (paramMap.containsKey(AttackCostParamType.NUMBER_OF_CUSTOMERS)
            && paramMap.containsKey(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER)
            && paramMap.get(AttackCostParamType.NUMBER_OF_CUSTOMERS).getValue() != null
            && paramMap.get(AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER).getValue() != null
        ) {

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
        } else {
            throw new IllegalInputException("Missing params");
        }
    }
}