package eu.hermeneut.service;

import eu.hermeneut.domain.Criticality;
import eu.hermeneut.domain.compact.output.CriticalityType;

import java.util.List;

public interface CriticalityService {
    Criticality save(Criticality criticality);

    List<Criticality> findAll();

    List<Criticality> findAllByCompanyProfileID(Long companyProfileID);

    Criticality findOneByCompanyProfileAttackStrategyAndCriticalityType(Long companyProfileID, Long attackSTrategyID, CriticalityType criticalityType);

    Criticality findOne(Long id);

    void delete(Long id);
}
