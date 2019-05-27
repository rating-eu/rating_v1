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

package eu.hermeneut.service.compact;

import eu.hermeneut.domain.Container;
import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.compact.input.AssetRisk;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.utils.tuple.Triad;

import java.util.Map;
import java.util.Set;

public interface AssetRiskService {
    Set<AssetRisk> getAssetRisks(Long selfAssessmentID) throws NotFoundException;
    Map<Long, Container> getContainerMap(MyAsset myAsset) throws NotFoundException;
    Triad<Float> getMaxLikelihoodVulnerabilityCriticality(Map<Long, AugmentedAttackStrategy> augmentedAttackStrategyMap, Map<Long, Container> containers);
}
