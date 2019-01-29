package eu.hermeneut.web.rest.attack.costs;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.AttackCostParam;
import eu.hermeneut.domain.enumeration.CostType;
import eu.hermeneut.exceptions.IllegalInputException;
import eu.hermeneut.exceptions.NotImplementedYetException;
import eu.hermeneut.service.attack.cost.AttackCostSwitch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AttackCostsController {
    private final Logger log = LoggerFactory.getLogger(AttackCostsController.class);

    @Autowired
    private AttackCostSwitch attackCostSwitch;

    @PostMapping("/{selfAssessmentID}/{type}/evaluate-attack-cost")
    @Timed
    @ResponseStatus(HttpStatus.CREATED)
    public AttackCost calculateCost(@PathVariable Long selfAssessmentID, @PathVariable CostType type, @Valid @RequestBody List<AttackCostParam> params) throws IllegalInputException, NotImplementedYetException {
        log.debug("REST request to calculate the cost " + type);

        return this.attackCostSwitch.calculateCost(selfAssessmentID, type, params);
    }
}
