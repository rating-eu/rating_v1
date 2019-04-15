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

package eu.hermeneut.domain.enumeration;

public enum AttackCostParamType {
    //(1) POST BREACH CUSTOMER PROTECTION
    NUMBER_OF_CUSTOMERS,
    PROTECTION_COST_PER_CUSTOMER,
    //(2) CUSTOMER BREACH NOTIFICATION
    NOTIFICATION_COST_PER_CUSTOMER,
    // (3) COST OF DOWNTIME PER HOUR
    EMPLOYEE_COST_PER_HOUR,
    FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE,
    AVERAGE_REVENUE_PER_HOUR,
    FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE,
    RECOVERY_COST,
    /*---*/REPAIR_SERVICES,
    /*---*/REPLACEMENT_PARTS,
    /*---*/LOST_DATA_RECOVERY,
    /*---*/OTHER_COSTS
}

