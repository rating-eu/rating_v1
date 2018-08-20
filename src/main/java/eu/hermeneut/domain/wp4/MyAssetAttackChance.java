package eu.hermeneut.domain.wp4;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.MyAsset;

public class MyAssetAttackChance {
    private MyAsset myAsset;
    private AttackStrategy attackStrategy;
    private Float likelihood;
    private Float vulnerability;
    private Float critical;
    private Float impact;

    public MyAssetAttackChance() {
    }

    public MyAssetAttackChance(MyAsset myAsset, AttackStrategy attackStrategy, Float likelihood, Float vulnerability, Float critical, Float impact) {
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

    public Float getCritical() {
        return critical;
    }

    public void setCritical(Float critical) {
        this.critical = critical;
    }

    public Float getImpact() {
        return impact;
    }

    public void setImpact(Float impact) {
        this.impact = impact;
    }
}
