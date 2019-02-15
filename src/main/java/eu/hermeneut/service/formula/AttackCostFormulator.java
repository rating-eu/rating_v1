package eu.hermeneut.service.formula;

import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.formula.AttackCostFormula;
import eu.hermeneut.exceptions.IllegalInputException;

import javax.validation.constraints.NotNull;
import java.util.List;

public interface AttackCostFormulator {
    AttackCostFormula formulate(@NotNull List<AttackCostParam> params) throws IllegalInputException;
}
