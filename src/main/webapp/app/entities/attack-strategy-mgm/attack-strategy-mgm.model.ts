import {BaseEntity} from './../../shared';
import {QuestionMgm} from '../question-mgm';
import {MitigationMgm} from '../mitigation-mgm';
import {LevelMgm} from '../level-mgm';
import {PhaseMgm} from '../phase-mgm';

export enum Frequency {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
}

export enum SkillLevel {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
}

export enum ResourceLevel {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
}

export enum Likelihood {
    LOW = 1,
    LOW_MEDIUM = 2,
    MEDIUM = 3,
    MEDIUM_HIGH = 4,
    HIGH = 5
}

export class AttackStrategyMgm implements BaseEntity {
    constructor(public id?: number,
                public name?: string,
                public description?: string,
                public frequency?: Frequency,
                public skill?: SkillLevel,
                public resources?: ResourceLevel,
                public likelihood?: Likelihood,
                public created?: any,
                public modified?: any,
                public levels?: LevelMgm[],
                public phases?: PhaseMgm[],
                public mitigations?: MitigationMgm[],
                public questions?: QuestionMgm[],
                public selfassessments?: BaseEntity[]) {
    }
}
