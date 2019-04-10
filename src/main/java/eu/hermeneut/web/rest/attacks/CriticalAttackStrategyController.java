package eu.hermeneut.web.rest.attacks;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.attacks.CriticalAttackStrategy;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.service.attacks.CriticalAttackStrategyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CriticalAttackStrategyController {

    @Autowired
    private CriticalAttackStrategyService criticalAttackStrategyService;

    @GetMapping("/{selfAssessmentID}/critical-attack-strategies")
    @Timed
    @PreAuthorize("@selfAssessmentGuardian.isCISO(#selfAssessmentID) || hasRole('ROLE_ADMIN')")
    @Secured({AuthoritiesConstants.CISO, AuthoritiesConstants.ADMIN})
    public List<CriticalAttackStrategy> getCriticalAttackStrategies(@PathVariable("selfAssessmentID") Long selfAssessmentID) throws NotFoundException {
        return this.criticalAttackStrategyService.getCriticalAttackStrategies(selfAssessmentID);
    }
}
