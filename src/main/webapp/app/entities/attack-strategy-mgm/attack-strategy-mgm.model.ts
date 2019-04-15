/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
