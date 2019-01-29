package eu.hermeneut.service.attack.cost;

import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotImplementedYetException;

import java.util.List;

public interface AttackCostSwitch {
    AttackCost calculateCost(Long selfAssessmentID, CostType type, List<AttackCostParam> params) throws IllegalInputException, NotImplementedYetException;
}
