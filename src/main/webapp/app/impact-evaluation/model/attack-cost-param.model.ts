import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { AttackCostParamType } from './enum/attack-cost-param-type.enum';

export class AttackCostParam {
    id: number;
    type: AttackCostParamType;
    value: number;
    min: number;
    max: number;
    selfAssessment: SelfAssessmentMgm;
}
