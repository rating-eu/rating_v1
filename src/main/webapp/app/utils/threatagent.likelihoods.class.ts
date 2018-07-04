import {ThreatAgentMgm} from "../entities/threat-agent-mgm";

export class ThreatAgentLikelihoods {
    threatAgent: ThreatAgentMgm;
    initialLikelihood: number;
    contextualLikelihood: number;
    refinedLikelihood: number;

    constructor(threatAgent: ThreatAgentMgm) {
        this.threatAgent = threatAgent;
    }
}
