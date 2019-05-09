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

import {AttackStrategyMgm} from "../../entities/attack-strategy-mgm";

export class CriticalAttackStrategy {
    /**
     * The AttackStrategy.
     */
    public attackStrategy: AttackStrategyMgm;
    /**
     * The number of assets that could be compromised.
     */
    public targetAssets: number;
    /**
     * The exact likelihood value from 1 to 5
     */
    public likelihood: number;
    /**
     * The exact vulnerability value from 1 to 5
     */
    public vulnerability: number;
    /**
     * The exact criticality value from 1 to 25
     */
    public criticality: number;
    /**
     * The criticality value expressed as a percentage.
     */
    public criticalityPercentage: number;

    /**
     * The awareness criticality value expressed as a percentage.
     */
    public awarenessCriticalityPercentage: number;

    /**
     * The SOC criticality value expressed as a percentage.
     */
    public socCriticalityPercentage: number;

    /**
     * The alert percentage, representing a weighted average of the criticalities.
     */
    public alertPercentage: number;
}
