import {ThreatAgentMgm} from "../threat-agent-mgm";
import {AttackStrategyMgm} from "../attack-strategy-mgm";

export class ThreatAgentInterest extends ThreatAgentMgm {
    public levelOfInterest: number;
    private attackStrategies: AttackStrategyMgm[];
}
