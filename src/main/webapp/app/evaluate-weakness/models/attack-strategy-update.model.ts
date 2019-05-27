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

import {AttackStrategyMgm} from '../../entities/attack-strategy-mgm';
import {Couple} from '../../utils/couple.class';
import {QuestionMgm} from '../../entities/question-mgm';
import {AnswerMgm} from '../../entities/answer-mgm';

export class AttackStrategyUpdate extends AttackStrategyMgm {
    constructor(
        public attackStrategy: AttackStrategyMgm,
        public questionsAnswerMap?: Map<number/*Question ID*/, Couple<QuestionMgm, AnswerMgm>>
    ) {
        super(
            attackStrategy.id,
            attackStrategy.name,
            attackStrategy.description,
            attackStrategy.frequency,
            attackStrategy.skill,
            attackStrategy.resources,
            attackStrategy.likelihood,
            attackStrategy.created,
            attackStrategy.modified,
            attackStrategy.levels,
            attackStrategy.phases,
            attackStrategy.mitigations
        );
    }
}
