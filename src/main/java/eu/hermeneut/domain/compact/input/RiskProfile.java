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

package eu.hermeneut.domain.compact.input;

import java.io.Serializable;
import java.util.Set;

public class RiskProfile implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long selfAssessmentID;

    private String selfAssessmentName;

    private Long companyID;

    private String companyName;

    /**
     * The set of the assets owned by the company, with their risk
     * associated.
     */
    private Set<AssetRisk> assetRisks;

    /**
     * The set of the attack strategies to which the company is vulnerable, with their risk
     * associated.
     */
    private Set<AttackStrategyRisk> attackStrategyRisks;

    public void setSelfAssessmentID(Long selfAssessmentID) {
        this.selfAssessmentID = selfAssessmentID;
    }

    public Long getSelfAssessmentID() {
        return selfAssessmentID;
    }

    public String getSelfAssessmentName() {
        return selfAssessmentName;
    }

    public void setSelfAssessmentName(String selfAssessmentName) {
        this.selfAssessmentName = selfAssessmentName;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Long getCompanyID() {
        return companyID;
    }

    public void setCompanyID(Long companyID) {
        this.companyID = companyID;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Set<AssetRisk> getAssetRisks() {
        return assetRisks;
    }

    public void setAssetRisks(Set<AssetRisk> assetRisks) {
        this.assetRisks = assetRisks;
    }

    public Set<AttackStrategyRisk> getAttackStrategyRisks() {
        return attackStrategyRisks;
    }

    public void setAttackStrategyRisks(Set<AttackStrategyRisk> attackStrategyRisks) {
        this.attackStrategyRisks = attackStrategyRisks;
    }
}
