package eu.hermeneut.web.rest.result;

import eu.hermeneut.domain.enumeration.*;
import eu.hermeneut.domain.result.Result;
import eu.hermeneut.service.result.ResultService;
import eu.hermeneut.utils.likelihood.overall.OverallCalculator;
import eu.hermeneut.web.rest.AssetResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing the result.
 */
@RestController
@RequestMapping("/api")
public class ResultController {
    private final Logger log = LoggerFactory.getLogger(AssetResource.class);

    @Autowired
    private ResultService resultService;

    @GetMapping("/likelihood/max")
    public int getMaxLikelihood() {
        final int numerator = AttackStrategyLikelihood.HIGH.getValue() * 5/*1+1+1+1+1*/ + AttackStrategyLikelihood.HIGH.getValue() * 5/*5*/;
        return numerator / OverallCalculator.DENOMINATOR;
    }

    @GetMapping("/result/{selfAssessmentID}")
    public Result getResult(@PathVariable Long selfAssessmentID) {
        return this.resultService.getThreatAgentsResult(selfAssessmentID);
    }
}
