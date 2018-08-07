import { BaseEntity } from './../../shared';
import {Frequency} from '../enumerations/Frequency.enum';
import {SkillLevel} from '../enumerations/SkillLevel.enum';
import {ResourceLevel} from '../enumerations/ResourceLevel.enum';
import {AttackStrategyLikelihood} from '../enumerations/AttackStrategyLikelihood.enum';
import {MitigationMgm} from '../mitigation-mgm';
import {LevelMgm} from '../level-mgm';
import {PhaseMgm} from '../phase-mgm';

export class AttackStrategyMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public frequency?: Frequency,
        public skill?: SkillLevel,
        public resources?: ResourceLevel,
        public likelihood?: AttackStrategyLikelihood,
        public created?: any,
        public modified?: any,
        public mitigations?: MitigationMgm[],
        public levels?: LevelMgm[],
        public phases?: PhaseMgm[],
    ) {
    }
}
