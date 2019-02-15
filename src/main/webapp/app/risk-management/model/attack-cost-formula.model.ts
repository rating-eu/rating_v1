import { AttackCostParamMgm } from './../../entities/attack-cost-param-mgm/attack-cost-param-mgm.model';
import { AttackCostMgm } from './../../entities/attack-cost-mgm/attack-cost-mgm.model';

export class AttackCostFormula {
    attackCost: AttackCostMgm;
    direct: boolean;
    attackCostParams: AttackCostParamMgm[];
    formula: string;
}
