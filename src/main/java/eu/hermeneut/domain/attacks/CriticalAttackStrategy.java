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

package eu.hermeneut.domain.attacks;

import eu.hermeneut.domain.AttackStrategy;

public class CriticalAttackStrategy {
    /**
     * The AttackStrategy
     */
    private AttackStrategy attackStrategy;

    /**
     * The number of involved assets among the ones identified by the target company.
     */
    private Integer targetAssets;

    /**
     * The likelihood associated with the AttackStrategy.
     */
    private Float likelihood;

    /**
     * The vulnerability associated with the AttackStrategy.
     */
    private Float vulnerability;

    /**
     * The criticality associated with the AttackStrategy.
     */
    private Float criticality;

    /**
     * The criticality percentage associated with the AttackStrategy.
     */
    private Float criticalityPercentage;

    /**
     * The awareness criticality associated with the AttackStrategy.
     */
    private Float awarenessCriticalityPercentage;

    /**
     * The SoC criticality associated with the AttackStrategy.
     */
    private Float socCriticalityPercentage;

    /**
     * The alert percentage, representing a weighted average of the criticalities.
     */
    private Float alertPercentage;

    public CriticalAttackStrategy(AttackStrategy attackStrategy) {
        this.attackStrategy = attackStrategy;
    }

    public AttackStrategy getAttackStrategy() {
        return attackStrategy;
    }

    public void setAttackStrategy(AttackStrategy attackStrategy) {
        this.attackStrategy = attackStrategy;
    }

    public Integer getTargetAssets() {
        return targetAssets;
    }

    public void setTargetAssets(Integer targetAssets) {
        this.targetAssets = targetAssets;
    }

    public Float getLikelihood() {
        return likelihood;
    }

    public void setLikelihood(Float likelihood) {
        this.likelihood = likelihood;
    }

    public Float getVulnerability() {
        return vulnerability;
    }

    public void setVulnerability(Float vulnerability) {
        this.vulnerability = vulnerability;
    }

    public Float getCriticality() {
        return criticality;
    }

    public Float getCriticalityPercentage() {
        return criticalityPercentage;
    }

    public void setCriticalityPercentage(Float criticalityPercentage) {
        this.criticalityPercentage = criticalityPercentage;
    }

    public void setCriticality(Float criticality) {
        this.criticality = criticality;
    }

    public Float getAwarenessCriticalityPercentage() {
        return awarenessCriticalityPercentage;
    }

    public void setAwarenessCriticalityPercentage(Float awarenessCriticalityPercentage) {
        this.awarenessCriticalityPercentage = awarenessCriticalityPercentage;
    }

    public Float getSocCriticalityPercentage() {
        return socCriticalityPercentage;
    }

    public void setSocCriticalityPercentage(Float socCriticalityPercentage) {
        this.socCriticalityPercentage = socCriticalityPercentage;
    }

    public Float getAlertPercentage() {
        return alertPercentage;
    }

    public void setAlertPercentage(Float alertPercentage) {
        this.alertPercentage = alertPercentage;
    }
}
