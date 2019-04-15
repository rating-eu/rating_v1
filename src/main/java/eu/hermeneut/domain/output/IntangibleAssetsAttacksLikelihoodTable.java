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

package eu.hermeneut.domain.output;


import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.domain.attackmap.AugmentedAttackStrategy;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class IntangibleAssetsAttacksLikelihoodTable {

    //Rows
    private List<AugmentedAttackStrategy> attackStrategies;
    //Columns
    private List<AssetCategory> assetCategories;
    //Column x Row intersections
    private Map<Long/*AssetCategory.ID*/, Set<Long/*AttackStrategy.ID*/>> attackStrategiesByAssetCategoryIDMap;

    public IntangibleAssetsAttacksLikelihoodTable(List<AugmentedAttackStrategy> attackStrategies, List<AssetCategory> assetCategories, Map<Long, Set<Long>> attackStrategiesByAssetCategoryIDMap) {
        this.attackStrategies = attackStrategies;
        this.assetCategories = assetCategories;
        this.attackStrategiesByAssetCategoryIDMap = attackStrategiesByAssetCategoryIDMap;
    }

    public List<AugmentedAttackStrategy> getAttackStrategies() {
        return attackStrategies;
    }

    public void setAttackStrategies(List<AugmentedAttackStrategy> attackStrategies) {
        this.attackStrategies = attackStrategies;
    }

    public List<AssetCategory> getAssetCategories() {
        return assetCategories;
    }

    public void setAssetCategories(List<AssetCategory> assetCategories) {
        this.assetCategories = assetCategories;
    }

    public Map<Long, Set<Long>> getAttackStrategiesByAssetCategoryIDMap() {
        return attackStrategiesByAssetCategoryIDMap;
    }

    public void setAttackStrategiesByAssetCategoryIDMap(Map<Long, Set<Long>> attackStrategiesByAssetCategoryIDMap) {
        this.attackStrategiesByAssetCategoryIDMap = attackStrategiesByAssetCategoryIDMap;
    }
}
