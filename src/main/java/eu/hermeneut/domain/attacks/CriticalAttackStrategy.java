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
     * The awareness criticality associated with the AttackStrategy.
     */
    private Float awarenessCriticality;

    /**
     * The SoC criticality associated with the AttackStrategy.
     */
    private Float socCriticality;

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

    public void setCriticality(Float criticality) {
        this.criticality = criticality;
    }

    public Float getAwarenessCriticality() {
        return awarenessCriticality;
    }

    public void setAwarenessCriticality(Float awarenessCriticality) {
        this.awarenessCriticality = awarenessCriticality;
    }

    public Float getSocCriticality() {
        return socCriticality;
    }

    public void setSocCriticality(Float socCriticality) {
        this.socCriticality = socCriticality;
    }
}
