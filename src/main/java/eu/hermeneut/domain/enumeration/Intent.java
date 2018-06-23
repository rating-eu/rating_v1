package eu.hermeneut.domain.enumeration;

/**
 * The Intent enumeration.
 * This defines whether the @{@link eu.hermeneut.domain.ThreatAgent} intends to cause harm.
 */
public enum Intent {
    /**
     * The @{@link eu.hermeneut.domain.ThreatAgent} starts with the intent to harm or
     * inappropriately use Intel assets, and the agent takes deliberate actions to achieve that result.
     */
    HOSTILE,
    /**
     * The @{@link eu.hermeneut.domain.ThreatAgent} is friendly and intends to protect Intel assets,
     * but accidentally or mistakenly takes actions that result in harm.
     */
    NON_HOSTILE
}
