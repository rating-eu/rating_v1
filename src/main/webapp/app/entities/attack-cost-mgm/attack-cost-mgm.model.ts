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
