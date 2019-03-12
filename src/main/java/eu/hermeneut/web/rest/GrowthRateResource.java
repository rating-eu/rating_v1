package eu.hermeneut.web.rest;

import eu.hermeneut.aop.annotation.UpdateIntangibleCapitalHook;
import eu.hermeneut.aop.annotation.UpdateIntangibleLossByAttacksHook;
import eu.hermeneut.domain.GrowthRate;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.service.GrowthRateService;
import eu.hermeneut.service.SelfAssessmentService;
import org.hibernate.validator.constraints.NotEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class GrowthRateResource {

    private static final Logger LOGGER = LoggerFactory.getLogger(GrowthRateResource.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private GrowthRateService growthRateService;

    @GetMapping("/{selfAssessmentID}/growth-rates")
    @Secured({AuthoritiesConstants.CISO})
    public List<GrowthRate> getGrowthRatesBySelfAssessment(@PathVariable("selfAssessmentID") Long selfAssessmentID) throws NotFoundException {
        LOGGER.debug("REST request to get GrowthRates!");

        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment NOT Found!");
        }

        return this.growthRateService.findAllBySelfAssessment(selfAssessmentID);
    }

    @PutMapping("/{selfAssessmentID}/growth-rates")
    @Secured({AuthoritiesConstants.CISO})
    @UpdateIntangibleCapitalHook
    @UpdateIntangibleLossByAttacksHook
    public List<GrowthRate> updateGrowthRatesBySelfAssessment(@PathVariable("selfAssessmentID") Long selfAssessmentID,
                                                              @RequestBody @NotEmpty @NotNull List<GrowthRate> growthRates) throws NotFoundException, IllegalInputException {
        LOGGER.debug("REST request to update GrowthRates!");

        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment NOT Found!");
        }

        List<GrowthRate> deniedRates = growthRates.stream().parallel().filter(growthRate -> growthRate.getId() == null || !growthRate.getSelfAssessment().getId().equals(selfAssessmentID)).collect(Collectors.toList());

        if (deniedRates != null && !deniedRates.isEmpty()) {
            throw new IllegalInputException("GrowthRates to be updated MUST have an ID and belong to the given SelfAssessment!!!");
        }

        growthRates = this.growthRateService.saveAll(growthRates);

        return growthRates;
    }

    @PutMapping("/growth-rates")
    @Secured({AuthoritiesConstants.CISO})
    public GrowthRate updateGrowthRate(@RequestBody @NotNull GrowthRate growthRate) throws NotFoundException, IllegalInputException {
        LOGGER.debug("REST request to update a GrowthRate!");

        Long id = growthRate.getId();

        if (id != null) {
            GrowthRate rate = this.growthRateService.findOne(id);

            if (rate == null) {
                throw new NotFoundException("Growth Rate NOT Found!!!");
            }
        } else {
            throw new IllegalInputException("GrowthRate to be updated MUST have an ID!!!");
        }

        return this.growthRateService.save(growthRate);
    }
}
