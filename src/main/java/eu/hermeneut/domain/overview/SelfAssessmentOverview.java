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
