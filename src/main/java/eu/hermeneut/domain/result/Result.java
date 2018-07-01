package eu.hermeneut.domain.result;

import eu.hermeneut.domain.ThreatAgent;

import java.util.Map;

public class Result {
    private float initialLikelihood;
    private float contextualLikelihood;
    private Map<ThreatAgent, Float> refinedVulnerability;

    public float getInitialLikelihood() {
        return initialLikelihood;
    }

    public void setInitialLikelihood(float initialLikelihood) {
        this.initialLikelihood = initialLikelihood;
    }

    public float getContextualLikelihood() {
        return contextualLikelihood;
    }

    public void setContextualLikelihood(float contextualLikelihood) {
        this.contextualLikelihood = contextualLikelihood;
    }

    public Map<ThreatAgent, Float> getRefinedVulnerability() {
        return refinedVulnerability;
    }

    public void setRefinedVulnerability(Map<ThreatAgent, Float> refinedVulnerability) {
        this.refinedVulnerability = refinedVulnerability;
    }
}
