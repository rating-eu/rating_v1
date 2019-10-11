import { BaseEntity } from './../../shared';

export const enum DataThreatLikelihood {
    'LOW',
    'MEDIUM',
    'HIGH'
}

export const enum DataImpact {
    'LOW',
    'MEDIUM',
    'HIGH',
    'VERY_HIGH'
}

export const enum DataRiskLevel {
    'LOW',
    'MEDIUM',
    'HIGH'
}

export class DataRiskLevelConfigMgm implements BaseEntity {
    constructor(
        public id?: number,
        public rationale?: string,
        public likelihood?: DataThreatLikelihood,
        public impact?: DataImpact,
        public risk?: DataRiskLevel,
        public operation?: BaseEntity,
    ) {
    }
}
