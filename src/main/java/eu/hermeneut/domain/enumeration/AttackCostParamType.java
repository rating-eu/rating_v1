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

