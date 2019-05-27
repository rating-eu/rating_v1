/*
 * Copyright 2019 HERMENEUT Consortium
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
import java.util.*;

@Service
@Transactional
public class ThreatAgentInterestServiceImpl implements ThreatAgentInterestService {
    @Autowired
    private CompanyProfileService companyProfileService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private ResultService resultService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Override
    public List<ThreatAgentInterest> getThreatAgentInterestsByCompanyProfileAndMyAsset(@NotNull Long companyProfileID, @NotNull Long myAssetID) throws NotFoundException {
        CompanyProfile companyProfile = this.companyProfileService.findOne(companyProfileID);

        if (companyProfile == null) {
            throw new NotFoundException("CompanyProfile NOT FOUND.");
        }

        Set<ThreatAgent> threatAgents = this.resultService.getThreatAgents(companyProfile.getId());

        if (threatAgents == null || threatAgents.isEmpty()) {
            throw new NotFoundException("ThreatAgents for CompanyProfile: " + companyProfileID + " NOT FOUND.");
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

        Map<Long, Float> levelsOfInterestMap = this.resultService.getLevelsOfInterest(companyProfileID);
        Iterator<ThreatAgent> threatAgentIterator = threatAgents.iterator();

        //Keep only the ThreatAgents that can perform at least one of the above AttackStrategies
        while (threatAgentIterator.hasNext()) {
            ThreatAgent threatAgent = threatAgentIterator.next();

            final ThreatAgentInterest threatAgentInterest = new ThreatAgentInterest(threatAgent);
            threatAgentInterest.setAttackStrategies(new HashSet<>());

            boolean canAttackThisAsset = false;

            for (AttackStrategy attackStrategy : attackStrategies) {
                if (ThreatAttackFilter.isAttackPossible(threatAgent, attackStrategy)) {
                    canAttackThisAsset = true;

                    threatAgentInterest.getAttackStrategies().add(attackStrategy);
                }
            }

            if (!canAttackThisAsset) {
                threatAgentIterator.remove();
            } else {
                threatAgentInterest.setLevelOfInterest(levelsOfInterestMap.getOrDefault(threatAgent.getId(), 0F));

                threatAgentInterests.add(threatAgentInterest);
            }
        }

        return threatAgentInterests;
    }

    @Override
    public List<ThreatAgentInterest> getThreatAgentInterestsByCompanyProfile(@NotNull Long companyProfileID) throws NotFoundException {
        CompanyProfile companyProfile = this.companyProfileService.findOne(companyProfileID);

        if (companyProfile == null) {
            throw new NotFoundException("CompanyProfile NOT FOUND.");
        }

        Set<ThreatAgent> threatAgents = this.resultService.getThreatAgents(companyProfile.getId());

        if (threatAgents == null || threatAgents.isEmpty()) {
            throw new NotFoundException("ThreatAgents for CompanyProfile: " + companyProfileID + " NOT FOUND.");
        }

        List<AttackStrategy> attackStrategies = this.attackStrategyService.findAll();
        List<ThreatAgentInterest> threatAgentInterests = new ArrayList<>();
        Map<Long, Float> levelsOfInterestMap = this.resultService.getLevelsOfInterest(companyProfileID);
        Iterator<ThreatAgent> threatAgentIterator = threatAgents.iterator();

        //Keep only the ThreatAgents that can perform at least one of the above AttackStrategies
        while (threatAgentIterator.hasNext()) {
            ThreatAgent threatAgent = threatAgentIterator.next();

            final ThreatAgentInterest threatAgentInterest = new ThreatAgentInterest(threatAgent);
            threatAgentInterest.setAttackStrategies(new HashSet<>());

            boolean canAttack = false;

            for (AttackStrategy attackStrategy : attackStrategies) {
                if (ThreatAttackFilter.isAttackPossible(threatAgent, attackStrategy)) {
                    canAttack = true;

                    threatAgentInterest.getAttackStrategies().add(attackStrategy);
                }
            }

            if (!canAttack) {
                threatAgentIterator.remove();
            } else {
                threatAgentInterest.setLevelOfInterest(levelsOfInterestMap.getOrDefault(threatAgent.getId(), 0F));

                threatAgentInterests.add(threatAgentInterest);
            }
        }

        return threatAgentInterests;
    }
}
