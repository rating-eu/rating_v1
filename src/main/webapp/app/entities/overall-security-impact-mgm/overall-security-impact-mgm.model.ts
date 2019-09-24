import { BaseEntity } from './../../shared';

export const enum DataImpact {
    'LOW',
    'MEDIUM',
    'HIGH',
    'VERY_HIGH'
}

export class OverallSecurityImpactMgm implements BaseEntity {
    constructor(
        public id?: number,
        public impact?: DataImpact,
        public operation?: BaseEntity,
        public impacts?: BaseEntity[],
    ) {
    }
}
