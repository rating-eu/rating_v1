package eu.hermeneut.web.rest.attack.costs;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.aop.annotation.CostQualifier;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotImplementedYetException;
import eu.hermeneut.service.AttackCostService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.attack.cost.AttackCostCalculator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AttackCostsController {
    private final Logger log = LoggerFactory.getLogger(AttackCostsController.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private AttackCostService attackCostService;

    @Autowired
    @CostQualifier(type = CostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS)
    private AttackCostCalculator postBreachCustomerProtection;

    @Autowired
    @CostQualifier(type = CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS)
    private AttackCostCalculator customerBreachNotificationCosts;

    @Autowired
    @CostQualifier(type = CostType.COST_OF_IT_DOWNTIME)
    private AttackCostCalculator costOfITDowntime;

    @PostMapping("/{selfAssessmentID}/calculate/cost/{type}")
    @Timed
    @ResponseStatus(HttpStatus.CREATED)
    public AttackCost calculateCost(@PathVariable Long selfAssessmentID, @PathVariable CostType type, @Valid @RequestBody List<AttackCostParam> params) throws IllegalInputException, NotImplementedYetException {
        log.debug("REST request to calculate the cost " + type);

        if (params == null || params.isEmpty()) {
            throw new IllegalInputException("Params CANNOT be NULL or EMPTY!");
        }

        switch (type) {
            case POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS: {
                AttackCost attackCost = this.postBreachCustomerProtection.calculate(params);
                List<AttackCost> costsByType = this.attackCostService.findAllBySelfAssessmentAndCostTypeWithDuplicateTypes(selfAssessmentID, type);

                costsByType.stream().forEach((cost) -> {
                    cost.setCosts(attackCost.getCosts());
                });

                this.attackCostService.save(costsByType);

                return attackCost;
            }
            case CUSTOMER_BREACH_NOTIFICATION_COSTS: {
                AttackCost attackCost = this.customerBreachNotificationCosts.calculate(params);
                List<AttackCost> costsByType = this.attackCostService.findAllBySelfAssessmentAndCostTypeWithDuplicateTypes(selfAssessmentID, type);

                costsByType.stream().forEach((cost) -> {
                    cost.setCosts(attackCost.getCosts());
                });

                this.attackCostService.save(costsByType);

                return attackCost;
            }
            case COST_OF_IT_DOWNTIME: {
                AttackCost attackCost = this.costOfITDowntime.calculate(params);
                List<AttackCost> costsByType = this.attackCostService.findAllBySelfAssessmentAndCostTypeWithDuplicateTypes(selfAssessmentID, type);

                costsByType.stream().forEach((cost) -> {
                    cost.setCosts(attackCost.getCosts());
                });

                this.attackCostService.save(costsByType);

                return attackCost;
            }
            default: {
                throw new NotImplementedYetException("Method to calculate this cost is NOT IMPLEMENTED YET!");
            }
        }
    }
}
