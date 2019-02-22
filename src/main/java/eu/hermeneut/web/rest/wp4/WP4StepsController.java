package eu.hermeneut.web.rest.wp4;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.*;
import eu.hermeneut.domain.wp4.MyAssetAttackChance;
import eu.hermeneut.domain.wp4.ThreatAgentInterest;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.wp4.WP4StepsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class WP4StepsController {
    private final Logger log = LoggerFactory.getLogger(WP4StepsController.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private ThreatAgentInterestService threatAgentInterestService;

    @Autowired
    private WP4StepsService wp4StepsService;

    @GetMapping("{selfAssessmentID}/wp4/my-assets/{myAssetID}/attack-chances")
    @Timed
    public List<MyAssetAttackChance> getAttackChances(@PathVariable("selfAssessmentID") Long selfAssessmentID, @PathVariable("myAssetID") Long myAssetID) throws NullInputException, NotFoundException {
        return this.wp4StepsService.getAttackChances(selfAssessmentID, myAssetID);
    }

    @GetMapping("{selfAssessmentID}/wp4/my-assets/{myAssetID}/threat-agent-interests")
    @Timed
    public List<ThreatAgentInterest> getThreatAgentInterestsByMyAsset(@PathVariable("selfAssessmentID") Long selfAssessmentID, @PathVariable("myAssetID") Long myAssetID) throws NullInputException, NotFoundException {
        SelfAssessment selfAssessment = null;

        if (selfAssessmentID != null) {
            selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);
        } else {
            throw new NullInputException("The selfAssessmentID can NOT be NULL!");
        }

        if (selfAssessment == null) {
            throw new NotFoundException("The selfAssessment with ID: " + selfAssessmentID + " was not found!");
        }

        List<ThreatAgentInterest> threatAgentInterests = this.threatAgentInterestService.getThreatAgentInterestsByMyAsset(selfAssessmentID, myAssetID);

        return threatAgentInterests;
    }
}
