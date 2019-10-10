import { BaseEntity } from './../../shared';

export const enum DataRiskLevel {
    'LOW',
    'MEDIUM',
    'HIGH'
}

export class OverallDataRiskMgm implements BaseEntity {
    constructor(
        public id?: number,
        public riskLevel?: DataRiskLevel,
        public operation?: BaseEntity,
    ) {
    }
}
