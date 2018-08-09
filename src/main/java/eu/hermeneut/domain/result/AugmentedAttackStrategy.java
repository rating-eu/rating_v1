package eu.hermeneut.domain.result;

import eu.hermeneut.domain.AttackStrategy;

public class AugmentedAttackStrategy extends AttackStrategy {
    private boolean enabled = false;

    private float initialLikelihood;

    private float cisoAnswersLikelihood;

    private float contextualLikelihood;

    private float externalAuditAnswersLikelihood;

    private float refinedLikelihood;

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

    public float getCisoAnswersLikelihood() {
        if (!isEnabled()) {
            return 0;
        }
        return cisoAnswersLikelihood;
    }

    public void setCisoAnswersLikelihood(float cisoAnswersLikelihood) {
        this.cisoAnswersLikelihood = cisoAnswersLikelihood;
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

    public float getExternalAuditAnswersLikelihood() {
        if (!isEnabled()) {
            return 0;
        }
        return externalAuditAnswersLikelihood;
    }

    public void setExternalAuditAnswersLikelihood(float externalAuditAnswersLikelihood) {
        this.externalAuditAnswersLikelihood = externalAuditAnswersLikelihood;
    }

    public float getRefinedLikelihood() {
        if (!isEnabled()) {
            return 0;
        }
        return refinedLikelihood;
    }

    public void setRefinedLikelihood(float refinedLikelihood) {
        this.refinedLikelihood = refinedLikelihood;
    }
}
