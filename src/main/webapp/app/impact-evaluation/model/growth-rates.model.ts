import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
export class GrowthRate {
    id: number;
    year: number;
    rate: number;
    selfAssessment: SelfAssessmentMgm;
}
