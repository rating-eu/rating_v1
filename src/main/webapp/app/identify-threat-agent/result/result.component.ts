import {Component, OnInit} from '@angular/core';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {ThreatAgentMgm} from '../../entities/threat-agent-mgm';
import {Couple} from '../../utils/couple.class';
import {Fraction} from '../../utils/fraction.class';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styles: []
})
export class ResultComponent implements OnInit {

    threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    threatAgentsPercentageArray: Couple<ThreatAgentMgm, Fraction>[];

    constructor(private dataSharingService: DatasharingService) {
    }

    ngOnInit() {
        this.threatAgentsMap = this.dataSharingService.threatAgentsMap;
        this.threatAgentsPercentageArray = Array.from(this.threatAgentsMap.values());
    }
}
