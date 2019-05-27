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

package eu.hermeneut.domain.formula;

import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;

import java.util.List;

public class AttackCostFormula {
    private AttackCost attackCost;
    private Boolean direct;
    private List<AttackCostParam> attackCostParams;
    private String formula;

    public AttackCost getAttackCost() {
        return attackCost;
    }

    public void setAttackCost(AttackCost attackCost) {
        this.attackCost = attackCost;
    }

    public boolean getDirect() {
        return direct;
    }

    public void setDirect(boolean direct) {
        this.direct = direct;
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
