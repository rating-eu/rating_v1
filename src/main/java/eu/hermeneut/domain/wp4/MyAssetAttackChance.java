package eu.hermeneut.domain.wp4;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.MyAsset;

public class MyAssetAttackChance {
    private MyAsset myAsset;
    private AttackStrategy attackStrategy;
    private Double likelihood;
    private Double vulnerability;
    private Double critical;
    private Double impact;

    public MyAssetAttackChance() {
    }

    public MyAssetAttackChance(MyAsset myAsset, AttackStrategy attackStrategy, Double likelihood, Double vulnerability, Double critical, Double impact) {
        this.myAsset = myAsset;
        this.attackStrategy = attackStrategy;
        this.likelihood = likelihood;
        this.vulnerability = vulnerability;
        this.critical = critical;
        this.impact = impact;
    }

    public MyAsset getMyAsset() {
        return myAsset;
    }

    public void setMyAsset(MyAsset myAsset) {
        this.myAsset = myAsset;
    }

    public AttackStrategy getAttackStrategy() {
        return attackStrategy;
    }

    public void setAttackStrategy(AttackStrategy attackStrategy) {
        this.attackStrategy = attackStrategy;
    }

    public Double getLikelihood() {
        return likelihood;
    }

    public void setLikelihood(Double likelihood) {
        this.likelihood = likelihood;
    }

    public Double getVulnerability() {
        return vulnerability;
    }

    public void setVulnerability(Double vulnerability) {
        this.vulnerability = vulnerability;
    }

    public Double getCritical() {
        return critical;
    }

    public void setCritical(Double critical) {
        this.critical = critical;
    }

    public Double getImpact() {
        return impact;
    }

    public void setImpact(Double impact) {
        this.impact = impact;
    }
}
