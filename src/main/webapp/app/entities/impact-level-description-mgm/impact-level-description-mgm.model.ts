import { BaseEntity } from './../../shared';

export class ImpactLevelDescriptionMgm implements BaseEntity {
    constructor(
        public id?: number,
        public impact?: number,
        public peopleEffects?: string,
        public reputation?: string,
        public serviceOutputs?: string,
        public legalAndCompliance?: string,
        public managementImpact?: string,
    ) {
    }
}
