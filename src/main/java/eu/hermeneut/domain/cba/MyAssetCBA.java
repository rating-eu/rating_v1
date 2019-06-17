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

package eu.hermeneut.domain.cba;

import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;
import eu.hermeneut.domain.dto.AssetDTO;

import java.util.List;

public class MyAssetCBA {

    private AssetDTO asset;

    private Integer impact;

    private List<AugmentedAttackStrategy> attackStrategies;

    public AssetDTO getAsset() {
        return asset;
    }

    public void setAsset(AssetDTO asset) {
        this.asset = asset;
    }

    public Integer getImpact() {
        return impact;
    }

    public void setImpact(Integer impact) {
        this.impact = impact;
    }

    public List<AugmentedAttackStrategy> getAttackStrategies() {
        return attackStrategies;
    }

    public void setAttackStrategies(List<AugmentedAttackStrategy> attackStrategies) {
        this.attackStrategies = attackStrategies;
    }
}
