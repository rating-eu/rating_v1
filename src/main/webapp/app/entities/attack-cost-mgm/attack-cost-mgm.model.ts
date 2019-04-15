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

import {BaseEntity} from './../../shared';

export enum CostType {
    BEFORE_THE_ATTACK_STATUS_RESTORATION = 0,
    INCREASED_SECURITY = 1,
    LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES = 2,
    NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS = 3,
    LIABILITY_COSTS = 4,
    CUSTOMER_BREACH_NOTIFICATION_COSTS = 5,
    POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS = 6,
    LOST_CUSTOMERS_RECOVERY = 7,
    PUBLIC_RELATIONS = 8,
    INCREASE_OF_INSURANCE_PREMIUMS = 9,
    LOSS_OF_REVENUES = 10,
    INCREASED_COST_TO_RAISE_DEBT = 11,
    VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES = 12,
    LOST_OR_NON_FULFILLED_CONTRACTS = 13,
    COST_OF_IT_DOWNTIME = 14
}

export class AttackCostMgm implements BaseEntity {
    constructor(
        public id?: number,
        public type?: CostType,
        public description?: string,
        public costs?: number,
        public myAsset?: BaseEntity,
    ) {
    }
}
