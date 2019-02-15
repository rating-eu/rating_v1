package eu.hermeneut.domain.formula;

import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;

import java.util.List;

public class AttackCostFormula {
    private AttackCost attackCost;
    private Boolean isDirect;
    private List<AttackCostParam> attackCostParams;
    private String formula;

    public AttackCost getAttackCost() {
        return attackCost;
    }

    public void setAttackCost(AttackCost attackCost) {
        this.attackCost = attackCost;
    }

    public boolean isDirect() {
        return isDirect;
    }

    public void setDirect(boolean direct) {
        isDirect = direct;
    }

    public List<AttackCostParam> getAttackCostParams() {
        return attackCostParams;
    }

    public void setAttackCostParams(List<AttackCostParam> attackCostParams) {
        this.attackCostParams = attackCostParams;
    }

    public String getFormula() {
        return formula;
    }

    public void setFormula(String formula) {
        this.formula = formula;
    }
}
