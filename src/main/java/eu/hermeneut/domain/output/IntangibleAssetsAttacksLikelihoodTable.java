package eu.hermeneut.domain.output;


import eu.hermeneut.domain.AssetCategory;
import eu.hermeneut.domain.result.AugmentedAttackStrategy;

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
