package eu.hermeneut.service.impl;

import eu.hermeneut.domain.GrowthRate;
import eu.hermeneut.repository.GrowthRateRepository;
import eu.hermeneut.service.GrowthRateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GrowthRateServiceImpl implements GrowthRateService {

    @Autowired
    private GrowthRateRepository growthRateRepository;

    @Override
    public GrowthRate save(GrowthRate growthRate) {
        return this.growthRateRepository.save(growthRate);
    }

    @Override
    public List<GrowthRate> saveAll(List<GrowthRate> growthRates) {
        return this.growthRateRepository.save(growthRates);
    }

    @Override
    public List<GrowthRate> findAll() {
        return this.growthRateRepository.findAll();
    }

    @Override
    public GrowthRate findOne(Long id) {
        return this.growthRateRepository.findOne(id);
    }

    @Override
    public void delete(Long id) {
        this.growthRateRepository.delete(id);
    }

    @Override
    public List<GrowthRate> findAllBySelfAssessment(Long selfAssessmentID) {
        return this.growthRateRepository.findAllBySelfAssessment(selfAssessmentID);
    }
}
