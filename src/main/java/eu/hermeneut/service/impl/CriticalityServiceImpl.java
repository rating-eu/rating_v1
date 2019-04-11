package eu.hermeneut.service.impl;

import eu.hermeneut.domain.Criticality;
import eu.hermeneut.domain.compact.output.CriticalityType;
import eu.hermeneut.repository.CriticalityRepository;
import eu.hermeneut.service.CriticalityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CriticalityServiceImpl implements CriticalityService {
    @Autowired
    private CriticalityRepository criticalityRepository;

    @Override
    public Criticality save(Criticality criticality) {
        return this.criticalityRepository.save(criticality);
    }

    @Override
    public List<Criticality> findAll() {
        return this.criticalityRepository.findAll();
    }

    @Override
    public List<Criticality> findAllByCompanyProfileID(Long companyProfileID) {
        return this.criticalityRepository.findAllByCompanyProfile(companyProfileID);
    }

    @Override
    public Criticality findOneByCompanyProfileAttackStrategyAndCriticalityType(Long companyProfileID, Long attackSTrategyID, CriticalityType criticalityType) {
        return this.criticalityRepository.findOneByCompanyProfileAttackStrategyAndCriticalityType(companyProfileID, attackSTrategyID, criticalityType);
    }

    @Override
    public Criticality findOne(Long id) {
        return this.criticalityRepository.findOne(id);
    }

    @Override
    public void delete(Long id) {
        this.criticalityRepository.delete(id);
    }
}
