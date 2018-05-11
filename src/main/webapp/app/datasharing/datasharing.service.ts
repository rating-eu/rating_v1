import {Injectable} from '@angular/core';
import {Fraction} from '../utils/fraction.class';
import {Couple} from '../utils/couple.class';
import {ThreatAgentMgm} from '../entities/threat-agent-mgm';

@Injectable()
export class DatasharingService {

    _threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;

    set threatAgentsMap(threatAgents: Map<String, Couple<ThreatAgentMgm, Fraction>>) {
        console.log('ThreatAgents param was: ' + JSON.stringify(threatAgents));

        this._threatAgentsMap = threatAgents;
        console.log('ThreatAgents SET to ' + JSON.stringify(this._threatAgentsMap));
    }

    get threatAgentsMap(): Map<String, Couple<ThreatAgentMgm, Fraction>> {
        console.log('ThreatAgents GET to ' + JSON.stringify(this._threatAgentsMap));

        return this._threatAgentsMap;
    }
}
