package eu.hermeneut.domain.wp4;

import eu.hermeneut.domain.AttackStrategy;
import eu.hermeneut.domain.ThreatAgent;

import java.util.Set;

public class ThreatAgentInterest extends ThreatAgent {

    public ThreatAgentInterest(ThreatAgent threatAgent) {
        this.setId(threatAgent.getId());
        this.setName(threatAgent.getName());
        this.setDescription(threatAgent.getDescription());

        this.setCreated(threatAgent.getCreated());
        this.setModified(threatAgent.getModified());

        this.setSkillLevel(threatAgent.getSkillLevel());
        this.setAccess(threatAgent.getAccess());
        this.setIntent(threatAgent.getIntent());

        this.setMotivations(threatAgent.getMotivations());

        this.setIdentifiedByDefault(threatAgent.getIdentifiedByDefault());
    }

    private float levelOfInterest;

    private Set<AttackStrategy> attackStrategies;

    public float getLevelOfInterest() {
        return levelOfInterest;
    }

    public void setLevelOfInterest(float levelOfInterest) {
        this.levelOfInterest = levelOfInterest;
    }

    public Set<AttackStrategy> getAttackStrategies() {
        return attackStrategies;
    }

    public void setAttackStrategies(Set<AttackStrategy> attackStrategies) {
        this.attackStrategies = attackStrategies;
    }
}
