package eu.hermeneut.domain.result;

import eu.hermeneut.domain.ThreatAgent;

import java.util.Map;

public class Result {
    private Map<ThreatAgent, Float> initialVulnerability;
    private Map<ThreatAgent, Float> contextualVulnerability;
    private Map<ThreatAgent, Float> refinedVulnerability;

    public Map<ThreatAgent, Float> getInitialVulnerability() {
        return initialVulnerability;
    }

    public void setInitialVulnerability(Map<ThreatAgent, Float> initialLikelihood) {
        this.initialVulnerability = initialLikelihood;
    }

    public Map<ThreatAgent, Float> getContextualVulnerability() {
        return contextualVulnerability;
    }

    public void setContextualVulnerability(Map<ThreatAgent, Float> contextualLikelihood) {
        this.contextualVulnerability = contextualLikelihood;
    }

    public Map<ThreatAgent, Float> getRefinedVulnerability() {
        return refinedVulnerability;
    }

    public void setRefinedVulnerability(Map<ThreatAgent, Float> refinedVulnerability) {
        this.refinedVulnerability = refinedVulnerability;
    }
}
