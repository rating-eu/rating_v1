import { BaseEntity } from './../../shared';

export class ImpactLevelMgm implements BaseEntity {
    constructor(
        public id?: number,
        public selfAssessmentID?: number,
        public impact?: number,
        public minLoss?: number,
        public maxLoss?: number,
    ) {
    }
}
