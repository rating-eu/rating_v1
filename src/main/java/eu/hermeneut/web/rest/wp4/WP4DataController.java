package eu.hermeneut.web.rest.wp4;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.wp4.MyAssetRisk;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.wp4.MyAssetRiskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class WP4DataController {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetRiskService myAssetRiskService;

    @GetMapping("{selfAssessmentID}/wp4/my-asset-risks")
    @Timed
    public List<MyAssetRisk> getMyAssetRisks(@PathVariable("selfAssessmentID") Long selfAssessmentID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment NOT Found!!!");
        }

        return this.myAssetRiskService.getMyAssetRisksBySelfAssessment(selfAssessmentID);
    }
}
