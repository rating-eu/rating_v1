package eu.hermeneut.service.attack.cost;

import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.exceptions.IllegalInputException;

import java.util.List;

public interface AttackCostCalculator {
    AttackCost calculate(List<AttackCostParam> params) throws IllegalInputException;
}
