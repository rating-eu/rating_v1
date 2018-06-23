import {BaseEntity} from './../../shared';
import {QuestionMgm} from '../question-mgm';
import {MitigationMgm} from '../mitigation-mgm';
import {LevelMgm} from '../level-mgm';
import {PhaseMgm} from '../phase-mgm';
import {Frequency} from '../enumerations/Frequency.enum';
import {SkillLevel} from '../enumerations/SkillLevel.enum';
import {ResourceLevel} from '../enumerations/ResourceLevel.enum';
import {AttackStrategyLikelihood} from '../enumerations/AttackStrategyLikelihood.enum';

export class AttackStrategyMgm implements BaseEntity {
    constructor(public id?: number,
                public name?: string,
                public description?: string,
                public frequency?: Frequency,
                public skill?: SkillLevel,
                public resources?: ResourceLevel,
                /**
                 * This is the initial likelihood of the AttackStrategy,
                 * calculated as the frequency-resources ratio.
                 * It seems to be redundant and error prone, hence it
                 * will probably be removed in the future.
                 */
                public likelihood?: AttackStrategyLikelihood,
                public created?: any,
                public modified?: any,
                public levels?: LevelMgm[],
                public phases?: PhaseMgm[],
                public mitigations?: MitigationMgm[],
                public questions?: QuestionMgm[],
                public selfassessments?: BaseEntity[]) {
    }
}
