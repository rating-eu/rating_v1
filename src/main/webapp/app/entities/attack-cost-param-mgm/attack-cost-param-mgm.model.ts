import { BaseEntity } from './../../shared';

export const enum AttackCostParamType {
    'NUMBER_OF_CUSTOMERS',
    'PROTECTION_COST_PER_CUSTOMER',
    'NOTIFICATION_COST_PER_CUSTOMER',
    'EMPLOYEE_COST_PER_HOUR',
    'FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE',
    'AVERAGE_REVENUE_PER_HOUR',
    'FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE',
    'RECOVERY_COST',
    'REPAIR_SERVICES',
    'REPLACEMENT_PARTS',
    'LOST_DATA_RECOVERY',
    'OTHER_COSTS'
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
