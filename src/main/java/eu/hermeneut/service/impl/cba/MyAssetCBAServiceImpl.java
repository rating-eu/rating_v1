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

package eu.hermeneut.service.impl.cba;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.Container;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.SelfAssessment;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.cba.MyAssetCBA;
import eu.hermeneut.domain.dto.AssetDTO;
import eu.hermeneut.domain.dto.UserDTO;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.service.AttackStrategyService;
import eu.hermeneut.service.MyAssetService;
import eu.hermeneut.service.SelfAssessmentService;
import eu.hermeneut.service.attackmap.AugmentedAttackStrategyService;
import eu.hermeneut.service.cba.MyAssetCBAService;
import eu.hermeneut.utils.filter.VulnerableAssetFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class MyAssetCBAServiceImpl implements MyAssetCBAService {

    @Autowired
    private SelfAssessmentService selfAssessmentService;

    @Autowired
    private MyAssetService myAssetService;

    @Autowired
    private AttackStrategyService attackStrategyService;

    @Autowired
    private AugmentedAttackStrategyService augmentedAttackStrategyService;


    @Override
    public Set<MyAssetCBA> getMyAssetsCBA(Long selfAssessmentID) throws NotFoundException {
        SelfAssessment selfAssessment = this.selfAssessmentService.findOne(selfAssessmentID);

        if (selfAssessment == null) {
            throw new NotFoundException("SlefAssessment not found!");
        }

        List<MyAsset> myAssets = this.myAssetService.findAllBySelfAssessment(selfAssessmentID);

        if (myAssets == null || myAssets.isEmpty()) {
            throw new NotFoundException("MyAssets not found!");
        }

        // Keep only the assets that are directly or indirectly vulnerable
        myAssets = myAssets.stream().parallel().filter(new VulnerableAssetFilter()).collect(Collectors.toList());

        Map<Long/*AttackStrategy.ID*/, AugmentedAttackStrategy> augmentedAttackStrategyMap = this.augmentedAttackStrategyService.getAugmentedAttackStrategyMap(selfAssessment.getCompanyProfile().getId());

        Set<MyAssetCBA> myAssetCBAs = new HashSet<>();

        for (MyAsset myAsset : myAssets) {
            final MyAssetCBA myAssetCBA = new MyAssetCBA();
            myAssetCBA.setAsset(Optional.of(myAsset.getAsset()).map(AssetDTO::new).orElse(null));
            myAssetCBA.setImpact(myAsset.getImpact());

            // Get All the Containers
            Map<Long, Container> containerMap = new HashMap<>();

            myAsset.getAsset().getContainers().stream().parallel().forEach(container -> {
                containerMap.put(container.getId(), container);
            });

            myAsset.getAsset().getDomainsOfInfluences().stream().parallel().forEach(domainOfInfluence -> {
                containerMap.put(domainOfInfluence.getContainer().getId(), domainOfInfluence.getContainer());
            });

            // Get all the possible Attacks on this Asset (By Comntainers)
            HashMap<Long /*ID*/, AttackStrategy> attackStrategies = new HashMap<>();

            containerMap.entrySet().stream().parallel().forEach((entry) -> {
                Container container = entry.getValue();

                this.attackStrategyService.findAllByContainer(container.getId())
                    .stream()
                    .parallel()
                    .forEach((attackStrategy) -> {
                        attackStrategies.put(attackStrategy.getId(), attackStrategy);
                    });
            });

            // Get the corresponding AugmentedAttackStrategies
            Map<Long, AugmentedAttackStrategy> augmentedAttackStrategies = new HashMap<>();

            attackStrategies.entrySet().stream().parallel().forEach((entry) -> {
                if (augmentedAttackStrategyMap.containsKey(entry.getKey())) {
                    augmentedAttackStrategies.put(entry.getKey(), augmentedAttackStrategyMap.get(entry.getKey()));
                }
            });

            myAssetCBA.setAttackStrategies(augmentedAttackStrategies.values().stream().parallel().collect(Collectors.toList()));

            myAssetCBAs.add(myAssetCBA);
        }


        return myAssetCBAs;
    }
}
