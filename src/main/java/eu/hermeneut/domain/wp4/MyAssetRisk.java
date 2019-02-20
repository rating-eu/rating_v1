package eu.hermeneut.domain.wp4;

import eu.hermeneut.domain.Mitigation;
import eu.hermeneut.domain.MyAsset;

import java.util.List;

public class MyAssetRisk extends MyAsset {

    private int critical;

    private int risk;

    private List<Mitigation> mitigations;

    public MyAssetRisk(MyAsset myAsset) {
        this.setId(myAsset.getId());
        this.setRanking(myAsset.getRanking());
        this.setEstimated(myAsset.isEstimated());
        this.setEconomicValue(myAsset.getEconomicValue());
        this.setImpact(myAsset.getImpact());
        this.setEconomicImpact(myAsset.getEconomicImpact());
        this.setLossValue(myAsset.getLossValue());
        this.setCosts(myAsset.getCosts());
        this.setAsset(myAsset.getAsset());
        this.setSelfAssessment(myAsset.getSelfAssessment());
        this.setQuestionnaire(myAsset.getQuestionnaire());
    }

    public int getCritical() {
        return critical;
    }

    public void setCritical(int critical) {
        this.critical = critical;
    }

    public int getRisk() {
        return risk;
    }

    public void setRisk(int risk) {
        this.risk = risk;
    }

    public List<Mitigation> getMitigations() {
        return mitigations;
    }

    public void setMitigations(List<Mitigation> mitigations) {
        this.mitigations = mitigations;
    }
}
