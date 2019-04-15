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

export enum AttackCostParamType {
    'NUMBER_OF_CUSTOMERS' = 'NUMBER_OF_CUSTOMERS',
    'PROTECTION_COST_PER_CUSTOMER' = 'PROTECTION_COST_PER_CUSTOMER',
    'NOTIFICATION_COST_PER_CUSTOMER' = 'NOTIFICATION_COST_PER_CUSTOMER',
    'EMPLOYEE_COST_PER_HOUR' = 'EMPLOYEE_COST_PER_HOUR',
    'FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE' = 'FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE',
    'AVERAGE_REVENUE_PER_HOUR' = 'AVERAGE_REVENUE_PER_HOUR',
    'FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE' = 'FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE',
    'RECOVERY_COST' = 'RECOVERY_COST',
    'REPAIR_SERVICES' = 'REPAIR_SERVICES',
    'REPLACEMENT_PARTS' = 'REPLACEMENT_PARTS',
    'LOST_DATA_RECOVERY' = 'LOST_DATA_RECOVERY',
    'OTHER_COSTS' = 'OTHER_COSTS'
}

export class AttackCostParamMgm implements BaseEntity {
    constructor(
        public id?: number,
        public type?: AttackCostParamType,
        public value?: number,
        public min?: number,
        public max?: number,
        public selfAssessment?: BaseEntity,
    ) {
    }
}
