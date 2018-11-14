package eu.hermeneut.domain.compact;

import eu.hermeneut.domain.result.Result;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.io.Serializable;
import java.util.Set;

public class RiskProfile implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long selfAssessmentID;

    /**
     * The Overall Likelihood value that
     * the most dangerous ThreatAgent identified could
     * attack your company. This field represents a percentage
     * value, hence it assumes values between 0 and 1.
     */
    @Min(0)
    @Max(1)
    private Float overallLikelihood;

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

    /**
     * The vulnerabilities (initial, contextual, refined)
     * associated with each of the identified ThreatAgents.
     */
    private Result vulnerabilities;

    public void setSelfAssessmentID(Long selfAssessmentID) {
        this.selfAssessmentID = selfAssessmentID;
    }

    public Float getOverallLikelihood() {
        return overallLikelihood;
    }

    public void setOverallLikelihood(Float overallLikelihood) {
        this.overallLikelihood = overallLikelihood;
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

    public Result getVulnerabilities() {
        return vulnerabilities;
    }

    public void setVulnerabilities(Result vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }
}
