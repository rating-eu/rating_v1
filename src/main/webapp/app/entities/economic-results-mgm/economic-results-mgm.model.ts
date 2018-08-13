import { BaseEntity } from './../../shared';

export class EconomicResultsMgm implements BaseEntity {
    constructor(
        public id?: number,
        public economicPerformance?: number,
        public intangibleDrivingEarnings?: number,
        public intangibleCapital?: number,
        public intangibleLossByAttacks?: number,
        public selfAssessment?: BaseEntity,
    ) {
    }
}
