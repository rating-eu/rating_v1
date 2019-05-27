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

package eu.hermeneut.domain.overview;

import eu.hermeneut.domain.MyAsset;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;

public class AugmentedMyAsset extends MyAsset {
    public AugmentedMyAsset(MyAsset myAsset) {
        super();
        this.setId(myAsset.getId());
        this.setAsset(myAsset.getAsset());
        this.setRanking(myAsset.getRanking());
        this.setEconomicValue(myAsset.getEconomicValue());
        this.setEstimated(myAsset.isEstimated());
        this.setSelfAssessment(myAsset.getSelfAssessment());
    }

    private AugmentedAttackStrategy augmentedAttackStrategy;

    public AugmentedAttackStrategy getAugmentedAttackStrategy() {
        return augmentedAttackStrategy;
    }

    public void setAugmentedAttackStrategy(AugmentedAttackStrategy augmentedAttackStrategy) {
        this.augmentedAttackStrategy = augmentedAttackStrategy;
    }
}
