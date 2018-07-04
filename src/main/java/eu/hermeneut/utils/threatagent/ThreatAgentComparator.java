package eu.hermeneut.utils.threatagent;

import eu.hermeneut.domain.ThreatAgent;

import java.util.Comparator;

public class ThreatAgentComparator implements Comparator<ThreatAgent> {
    @Override
    public int compare(ThreatAgent threatAgent1, ThreatAgent threatAgent2) {
        return threatAgent1.getSkillLevel().getValue() - threatAgent2.getSkillLevel().getValue();
    }
}
