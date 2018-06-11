import {BaseEntity} from './../../shared';
import {QuestionMgm} from '../question-mgm';
import {MitigationMgm} from '../mitigation-mgm';
import {LevelMgm} from '../level-mgm';
import {PhaseMgm} from '../phase-mgm';
import {AnswerLikelihood} from '../enumerations/AnswerLikelihood.enum';
import {Frequency} from '../enumerations/Frequency.enum';
import {SkillLevel} from '../enumerations/SkillLevel.enum';
import {ResourceLevel} from '../enumerations/ResourceLevel.enum';

export class AttackStrategyMgm implements BaseEntity {
    constructor(public id?: number,
                public name?: string,
                public description?: string,
                public frequency?: Frequency,
                public skill?: SkillLevel,
                public resources?: ResourceLevel,
                public likelihood?: AnswerLikelihood,
                public created?: any,
                public modified?: any,
                public levels?: LevelMgm[],
                public phases?: PhaseMgm[],
                public mitigations?: MitigationMgm[],
                public questions?: QuestionMgm[],
                public selfassessments?: BaseEntity[]) {
    }
}
