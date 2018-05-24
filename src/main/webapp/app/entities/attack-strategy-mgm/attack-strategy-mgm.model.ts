import { BaseEntity } from './../../shared';
import {QuestionMgm} from '../question-mgm';
import {MitigationMgm} from '../mitigation-mgm';

export const enum Frequency {
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
        public frequency?: Frequency,
        public skill?: SkillLevel,
        public resources?: ResourceLevel,
        public likelihood?: Likelihood,
        public created?: any,
        public modified?: any,
        public levels?: BaseEntity[],
        public phases?: BaseEntity[],
        public mitigations?: MitigationMgm[],
        public questions?: QuestionMgm[],
        public selfassessments?: BaseEntity[],
    ) {
    }
}
