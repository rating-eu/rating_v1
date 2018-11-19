package eu.hermeneut.web.rest.attackmap;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.attackmap.AttackCKC7Matrix;
import eu.hermeneut.domain.enumeration.QuestionnairePurpose;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.utils.likelihood.answer.AnswerCalculator;
import eu.hermeneut.utils.likelihood.attackstrategy.AttackStrategyCalculator;
import eu.hermeneut.utils.likelihood.overall.OverallCalculator;
import eu.hermeneut.web.rest.AssetResource;
import eu.hermeneut.web.rest.result.ResultController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * REST controller for managing the AttackMap.
 */
@RestController
@RequestMapping("/api")
public class AttackMapController {

    private final Logger log = LoggerFactory.getLogger(AssetResource.class);

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private AugmentedAttackStrategyService augmentedAttackStrategyService;

    @GetMapping("/{selfAssessmentID}/attack-matrix")
    public AttackCKC7Matrix getAttackMatrix(@PathVariable Long selfAssessmentID) throws NotFoundException {
        //#1 fetch the SelfAssessment
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with ID: " + selfAssessmentID + "NOT FOUND!");
        }

        //Map used to update the likelihood of an AttackStrategy in time O(1).
        Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap =
            this.augmentedAttackStrategyService.getAugmentedAttackStrategyMap(selfAssessmentID);

        AttackCKC7Matrix attackMatrix = new AttackCKC7Matrix(augmentedAttackStrategyMap);

        return attackMatrix;
    }
}
