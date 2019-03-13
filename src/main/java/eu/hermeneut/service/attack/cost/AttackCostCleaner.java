package eu.hermeneut.service.attack.cost;

import eu.hermeneut.domain.SelfAssessment;

public interface AttackCostCleaner {
    void clean(SelfAssessment selfAssessment);
}
