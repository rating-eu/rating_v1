import { ThreatAgentMgm } from './../../entities/threat-agent-mgm/threat-agent-mgm.model';
import { AttackStrategyMgm } from './../../entities/attack-strategy-mgm/attack-strategy-mgm.model';

export class ThreatAgentInterest extends ThreatAgentMgm {
    public levelOfInterest: number;
    private attackStrategies: AttackStrategyMgm[];
}
