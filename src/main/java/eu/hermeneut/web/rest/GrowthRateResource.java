package eu.hermeneut.web.rest;

import eu.hermeneut.domain.GrowthRate;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.repository.GrowthRateRepository;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.service.SelfAssessmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GrowthRateResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(GrowthRateResource.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private GrowthRateRepository growthRateRepository;

    private static final Map<Integer, Double> GROWTH_MAP = new HashMap<>();

    static {
        GROWTH_MAP.put(1, 0.150D);
        GROWTH_MAP.put(2, 0.150D);
        GROWTH_MAP.put(3, 0.150D);
        GROWTH_MAP.put(4, 0.150D);
        GROWTH_MAP.put(5, 0.150D);

        GROWTH_MAP.put(6, 0.126D);
        GROWTH_MAP.put(7, 0.102D);
        GROWTH_MAP.put(8, 0.078D);
        GROWTH_MAP.put(9, 0.054D);
        GROWTH_MAP.put(10, 0.030D);
    }

    @GetMapping("/{selfAssessmentID}/growth-rates")
    @Secured({AuthoritiesConstants.CISO})
    public List<GrowthRate> getGrowthRatesBySelfAssessment(@PathVariable("selfAssessmentID") Long selfAssessmentID) throws NotFoundException {
        LOGGER.debug("REST request to get GrowthRates!");

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

            growthRates = this.growthRateRepository.save(growthRates);
        }

        return growthRates;
    }
}
