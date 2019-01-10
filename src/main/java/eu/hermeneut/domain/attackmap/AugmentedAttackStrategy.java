package eu.hermeneut.domain.attackmap;

import eu.hermeneut.domain.AttackStrategy;

public class AugmentedAttackStrategy extends AttackStrategy implements Cloneable {
    private boolean enabled = false;

    private float initialLikelihood;

    private float contextualVulnerability;

    private float contextualLikelihood;

    private float refinedVulnerability;

    private float refinedLikelihood;

    public AugmentedAttackStrategy() {
    }

    public AugmentedAttackStrategy(AttackStrategy attackStrategy) {
        super();
        this.id = attackStrategy.getId();
        this.name = attackStrategy.getName();
        this.description = attackStrategy.getDescription();
        this.frequency = attackStrategy.getFrequency();
        this.skill = attackStrategy.getSkill();
        this.resources = attackStrategy.getResources();
        this.likelihood = attackStrategy.getLikelihood();
        this.created = attackStrategy.getCreated();
        this.modified = attackStrategy.getModified();
        this.mitigations = attackStrategy.getMitigations();
        this.levels = attackStrategy.getLevels();
        this.phases = attackStrategy.getPhases();
    }

    public AugmentedAttackStrategy(AttackStrategy attackStrategy, boolean enabled) {
        super();
        this.enabled = enabled;
        this.id = attackStrategy.getId();
        this.name = attackStrategy.getName();
        this.description = attackStrategy.getDescription();
        this.frequency = attackStrategy.getFrequency();
        this.skill = attackStrategy.getSkill();
        this.resources = attackStrategy.getResources();
        this.likelihood = attackStrategy.getLikelihood();
        this.created = attackStrategy.getCreated();
        this.modified = attackStrategy.getModified();
        this.mitigations = attackStrategy.getMitigations();
        this.levels = attackStrategy.getLevels();
        this.phases = attackStrategy.getPhases();
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public float getInitialLikelihood() {
        if (!isEnabled()) {
            return 0;
        }
        return initialLikelihood;
    }

    public void setInitialLikelihood(float initialLikelihood) {
        this.initialLikelihood = initialLikelihood;
    }

    public float getContextualVulnerability() {
        if (!isEnabled()) {
            return 0;
        }
        return contextualVulnerability;
    }

    public void setContextualVulnerability(float contextualVulnerability) {
        this.contextualVulnerability = contextualVulnerability;
    }

    public float getContextualLikelihood() {
        if (!isEnabled()) {
            return 0;
        }
        return contextualLikelihood;
    }

    public void setContextualLikelihood(float contextualLikelihood) {
        this.contextualLikelihood = contextualLikelihood;
    }

    public float getRefinedVulnerability() {
        if (!isEnabled()) {
            return 0;
        }
        return refinedVulnerability;
    }

    public void setRefinedVulnerability(float refinedVulnerability) {
        this.refinedVulnerability = refinedVulnerability;
    }

    public float getRefinedLikelihood() {
        if (!isEnabled()) {
            return 0;
        }
        return refinedLikelihood;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public void setRefinedLikelihood(float refinedLikelihood) {
        this.refinedLikelihood = refinedLikelihood;
    }
}
