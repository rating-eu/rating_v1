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

export class AugmentedAttackStrategy extends AttackStrategyMgm {
    public enabled: boolean;
    public initialLikelihood: number;
    public contextualVulnerability: number;
    public contextualLikelihood: number;
    public refinedVulnerability: number;
    public refinedLikelihood: number;

    constructor(private attackStrategy: AttackStrategyMgm) {
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
            attackStrategy.mitigations,
            attackStrategy.levels,
            attackStrategy.phases
        );
    }
}
