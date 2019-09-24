import { BaseEntity } from './../../shared';

export const enum SecurityPillar {
    'CONFIDENTIALITY',
    'INTEGRITY',
    'AVAILABILITY'
}

export const enum DataImpact {
    'LOW',
    'MEDIUM',
    'HIGH',
    'VERY_HIGH'
}

export class SecurityImpactMgm implements BaseEntity {
    constructor(
        public id?: number,
        public securityPillar?: SecurityPillar,
        public impact?: DataImpact,
        public operation?: BaseEntity,
        public overallSecurityImpact?: BaseEntity,
    ) {
    }
}
