package eu.hermeneut.domain.overview;

import java.util.Set;

public class SelfAssessmentOverview {
    private long selfAssessmentID;
    private Set<AugmentedMyAsset> augmentedMyAssets;

    public long getSelfAssessmentID() {
        return selfAssessmentID;
    }

    public void setSelfAssessmentID(long selfAssessmentID) {
        this.selfAssessmentID = selfAssessmentID;
    }

    public Set<AugmentedMyAsset> getAugmentedMyAssets() {
        return augmentedMyAssets;
    }

    public void setAugmentedMyAssets(Set<AugmentedMyAsset> augmentedMyAssets) {
        this.augmentedMyAssets = augmentedMyAssets;
    }
}
