import {Component, OnInit} from '@angular/core';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {ThreatAgentMgm} from '../../entities/threat-agent-mgm';
import {Couple} from '../../utils/couple.class';
import {Fraction} from '../../utils/fraction.class';
import {IdentifyThreatAgentService} from '../identify-threat-agent.service';
import {MotivationMgm} from '../../entities/motivation-mgm';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styles: []
})
export class ResultComponent implements OnInit {

    threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    threatAgentsPercentageArray: Couple<ThreatAgentMgm, Fraction>[];
    motivations: MotivationMgm[];
    defaultThreatAgents: ThreatAgentMgm[];

    constructor(private dataSharingService: DatasharingService, private identifyThreatAgentService: IdentifyThreatAgentService) {
    }

    ngOnInit() {
        this.threatAgentsMap = this.dataSharingService.threatAgentsMap;
        this.threatAgentsPercentageArray = Array.from(this.threatAgentsMap.values());

        this.identifyThreatAgentService.getDefaultThreatAgents().subscribe((response) => {
            this.defaultThreatAgents = response as ThreatAgentMgm[];

            this.defaultThreatAgents.forEach((value) => {// Add the default Threat-Agents to the list
                this.threatAgentsPercentageArray.push(new Couple<ThreatAgentMgm, Fraction>(value, new Fraction(1, 1)));
            });
        });

        console.log('Calling to find all motivations...');
        this.identifyThreatAgentService.findAllMotivations().subscribe((response) => {
            this.motivations = response as MotivationMgm[];
        });
    }

    hasMotivation(threatAgent: ThreatAgentMgm, motivation: MotivationMgm): boolean {
        const found = threatAgent.motivations.find((m) => {
            return m.id === motivation.id;
        });

        return found !== undefined;
    }

    saveIdentfiedThreatAgents() {
        console.log('Saving identified threat agents...');
    }

    discardIdentfiedThreatAgents() {
        console.log('Discarding identified threat agents...');
    }
}
