package eu.hermeneut.domain.overview;

import java.util.List;

public class SelfAssessmentOverview {
    private long selfAssessmentID;
    private List<AugmentedMyAsset> augmentedMyAssets;

    public long getSelfAssessmentID() {
        return selfAssessmentID;
    }

    public void setSelfAssessmentID(long selfAssessmentID) {
        this.selfAssessmentID = selfAssessmentID;
    }

    public List<AugmentedMyAsset> getAugmentedMyAssets() {
        return augmentedMyAssets;
    }

    public void setAugmentedMyAssets(List<AugmentedMyAsset> augmentedMyAssets) {
        this.augmentedMyAssets = augmentedMyAssets;
    }
}
