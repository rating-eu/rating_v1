import { BaseEntity } from './../../shared';

export const enum AS_Frequency {
    'LOW',
    'MEDIUM',
    'HIGH'
}

export const enum SkillLevel {
    'HIGH',
    'MEDIUM',
    'LOW'
}

export const enum ResourceLevel {
    'LOW',
    'MEDIUM',
    'HIGH'
}

export const enum Likelihood {
    'LOW',
    'LOW_MEDIUM',
    'MEDIUM',
    'MEDIUM_HIGH',
    'HIGH'
}

export class AttackStrategyMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public freq?: AS_Frequency,
        public skill?: SkillLevel,
        public resources?: ResourceLevel,
        public likelihood?: Likelihood,
        public created?: any,
        public modified?: any,
        public levels?: BaseEntity[],
        public phases?: BaseEntity[],
        public mitigations?: BaseEntity[],
        public answstrategies?: BaseEntity[],
        public selfassessments?: BaseEntity[],
    ) {
    }
}
