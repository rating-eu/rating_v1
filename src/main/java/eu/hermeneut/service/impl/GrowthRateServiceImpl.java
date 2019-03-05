package eu.hermeneut.service.impl;

import eu.hermeneut.domain.GrowthRate;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.repository.GrowthRateRepository;
import eu.hermeneut.service.GrowthRateService;
import eu.hermeneut.service.SelfAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class GrowthRateServiceImpl implements GrowthRateService {

    @Autowired
    private GrowthRateRepository growthRateRepository;

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    private static final Map<Integer, BigDecimal> GROWTH_MAP = new HashMap<>();

    static {
        GROWTH_MAP.put(1, new BigDecimal("0.150"));
        GROWTH_MAP.put(2, new BigDecimal("0.150"));
        GROWTH_MAP.put(3, new BigDecimal("0.150"));
        GROWTH_MAP.put(4, new BigDecimal("0.150"));
        GROWTH_MAP.put(5, new BigDecimal("0.150"));

        GROWTH_MAP.put(6, new BigDecimal("0.126"));
        GROWTH_MAP.put(7, new BigDecimal("0.102"));
        GROWTH_MAP.put(8, new BigDecimal("0.078"));
        GROWTH_MAP.put(9, new BigDecimal("0.054"));
        GROWTH_MAP.put(10, new BigDecimal("0.030"));
    }


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

    /**
     * Returns the existing GrowthRates or creates the DEFAULT GrowthRates for the given SelfAssessment.
     *
     * @param selfAssessmentID the SelfAssessment for which to get the GrowthRates.
     * @return Returns the existing GrowthRates or creates the DEFAULT GrowthRates for the given SelfAssessment.
     * @throws NotFoundException if the SelfAssessment does NOT Exist!!!
     */
    @Override
    public List<GrowthRate> findAllBySelfAssessment(Long selfAssessmentID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment NOT Found!");
        }

        List<GrowthRate> growthRates = this.growthRateRepository.findAllBySelfAssessment(selfAssessmentID);

        if (growthRates == null || growthRates.isEmpty()) {
            growthRates = new ArrayList<>();

            for (int year = 1; year <= 10; year++) {
                final GrowthRate growthRate = new GrowthRate();
                growthRate.setYear(year);
                growthRate.setRate(GROWTH_MAP.get(year));

                growthRate.setSelfAssessment(selfAssessment);

                growthRates.add(growthRate);
            }

            growthRates = this.saveAll(growthRates);
        }

        return growthRates;
    }
}
