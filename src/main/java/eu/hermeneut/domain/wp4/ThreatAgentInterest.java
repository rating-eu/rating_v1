package eu.hermeneut.domain.wp4;

import eu.hermeneut.domain.ThreatAgent;

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

    public float getLevelOfInterest() {
        return levelOfInterest;
    }

    public void setLevelOfInterest(float levelOfInterest) {
        this.levelOfInterest = levelOfInterest;
    }
}
