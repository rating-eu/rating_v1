package eu.hermeneut.domain.result;

import java.util.Map;

public class Result {
    private Map<Long/*ThreatAgentID*/, Float> initialVulnerability;
    private Map<Long/*ThreatAgentID*/, Float> contextualVulnerability;
    private Map<Long/*ThreatAgentID*/, Float> refinedVulnerability;

    public Map<Long, Float> getInitialVulnerability() {
        return initialVulnerability;
    }

    public void setInitialVulnerability(Map<Long, Float> initialLikelihood) {
        this.initialVulnerability = initialLikelihood;
    }

    public Map<Long, Float> getContextualVulnerability() {
        return contextualVulnerability;
    }

    public void setContextualVulnerability(Map<Long, Float> contextualLikelihood) {
        this.contextualVulnerability = contextualLikelihood;
    }

    public Map<Long, Float> getRefinedVulnerability() {
        return refinedVulnerability;
    }

    public void setRefinedVulnerability(Map<Long, Float> refinedVulnerability) {
        this.refinedVulnerability = refinedVulnerability;
    }
}
