package eu.hermeneut.service.formula;

import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.formula.AttackCostFormula;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;

public interface FormulatorSwitch {
    AttackCostFormula formulateCost(Long selfAssessmentID, AttackCost attackCost) throws NotFoundException, IllegalInputException;
}
