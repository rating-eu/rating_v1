package eu.hermeneut.service.impl;

import eu.hermeneut.domain.*;
import eu.hermeneut.domain.wp4.ThreatAgentInterest;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.*;
import eu.hermeneut.service.result.ResultService;
import eu.hermeneut.utils.attackstrategy.ThreatAttackFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Transactional
public class ThreatAgentInterestServiceImpl implements ThreatAgentInterestService {
    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private ThreatAgentService threatAgentService;

    @Autowired
    private ResultService resultService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Override
    public List<ThreatAgentInterest> getThreatAgentInterestsByMyAsset(@NotNull Long selfAssessmentID, @NotNull Long myAssetID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SelfAssessment with ID: " + selfAssessmentID + " NOT FOUND.");
        }

        //TODO update this when the threatagents identified will be saved in the DB
        List<ThreatAgent> threatAgents = new ArrayList<>(selfAssessment.getThreatagents());

        if (threatAgents == null || threatAgents.isEmpty()) {
            throw new NotFoundException("ThreatAgent for SelfAssessment with ID: " + selfAssessmentID + " NOT FOUND.");
        }

        MyAsset myAsset = this.myAssetService.findOne(myAssetID);

        if (myAsset == null) {
            throw new NotFoundException("MyAsset with ID: " + myAssetID + " NOT FOUND.");
        }

        List<ThreatAgentInterest> threatAgentInterests = new ArrayList<>();
        Set<Container> containers = myAsset.getAsset().getContainers();

        //Get AttackStrategies fro each Container of the input Asset
        List<AttackStrategy> attackStrategies = new ArrayList<>();

        for (Container container : containers) {
            attackStrategies.addAll(this.attackStrategyService.findAllByContainer(container.getId()));
        }

        Map<Long, Float> levelsOfInterestMap = this.resultService.getLevelsOfInterest(selfAssessmentID);

        //Keep only the ThreatAgents that can perform at least one of the above AttackStrategies
        for (int i = 0; i < threatAgents.size(); i++) {
            ThreatAgent threatAgent = threatAgents.get(i);
            boolean canAttackThisAsset = false;

            for (AttackStrategy attackStrategy : attackStrategies) {
                if (ThreatAttackFilter.isAttackPossible(threatAgent, attackStrategy)) {
                    canAttackThisAsset = true;
                    break;
                }
            }

            if (!canAttackThisAsset) {
                threatAgents.remove(i);
                i--;
            } else {
                final ThreatAgentInterest threatAgentInterest = new ThreatAgentInterest(threatAgent);
                threatAgentInterest.setLevelOfInterest(levelsOfInterestMap.getOrDefault(threatAgent.getId(), 0F));

                threatAgentInterests.add(threatAgentInterest);
            }
        }

        return threatAgentInterests;
    }
}
