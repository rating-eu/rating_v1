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

package eu.hermeneut.domain.dto;

import eu.hermeneut.domain.AttackCost;
import eu.hermeneut.domain.MyAsset;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

public class MyAssetDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long myAssetID;

    private String myAssetName;

    private Set<MyAsset> indirectAssets;

    /**
     * Both the Direct and Indirect Costs
     */
    private Set<AttackCost> attackCosts;

    /**
     * The likelihood
     */
    private float likelihood;

    /**
     * The vulnerability
     */
    private float vulnerability;

    /**
     * The criticality percentage.
     */
    @Min(0)
    @Max(1)
    private float criticality;

    @Min(1)
    @Max(5)
    private int priority;

    public MyAssetDTO() {
        this.indirectAssets = new HashSet<>();
        this.attackCosts = new HashSet<>();
    }

    public Long getMyAssetID() {
        return myAssetID;
    }

    public void setMyAssetID(Long myAssetID) {
        this.myAssetID = myAssetID;
    }

    public String getMyAssetName() {
        return myAssetName;
    }

    public void setMyAssetName(String myAssetName) {
        this.myAssetName = myAssetName;
    }

    public Set<MyAsset> getIndirectAssets() {
        return indirectAssets;
    }

    public void setIndirectAssets(Set<MyAsset> indirectAssets) {
        this.indirectAssets = indirectAssets;
    }

    public Set<AttackCost> getAttackCosts() {
        return attackCosts;
    }

    public void setAttackCosts(Set<AttackCost> attackCosts) {
        this.attackCosts = attackCosts;
    }

    public float getLikelihood() {
        return likelihood;
    }

    public void setLikelihood(float likelihood) {
        this.likelihood = likelihood;
    }

    public float getVulnerability() {
        return vulnerability;
    }

    public void setVulnerability(float vulnerability) {
        this.vulnerability = vulnerability;
    }

    public float getCriticality() {
        return criticality;
    }

    public void setCriticality(float criticality) {
        this.criticality = criticality;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }
}
