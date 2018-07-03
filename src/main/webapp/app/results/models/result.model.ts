import {ThreatAgentMgm} from "../../entities/threat-agent-mgm";

export class Result {
    constructor(
        public initialVulnerability: Map<ThreatAgentMgm, number>,
        public contextualVulnerability: Map<ThreatAgentMgm, number>,
        public refinedVulnerability: Map<ThreatAgentMgm, number>
    ) {
    }
}
