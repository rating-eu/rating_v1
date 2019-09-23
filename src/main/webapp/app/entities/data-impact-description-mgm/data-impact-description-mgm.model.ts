import { BaseEntity } from './../../shared';

export const enum DataImpact {
    'LOW',
    'MEDIUM',
    'HIGH',
    'VERY_HIGH'
}

export const enum Language {
    'IT',
    'EN',
    'DE',
    'ES',
    'FR',
    'PT_PT'
}

export class DataImpactDescriptionMgm implements BaseEntity {
    constructor(
        public id?: number,
        public impact?: DataImpact,
        public description?: string,
        public language?: Language,
    ) {
    }
}
