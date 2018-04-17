import { Component, OnInit } from '@angular/core';
import { Principal } from '../shared';

@Component({
    selector: 'jhi-identify-threat-agent',
    templateUrl: './identify-threat-agent.component.html'
})
export class IdentifyThreatAgentComponent implements OnInit {
    account: Account;

    constructor(private principal: Principal) {}

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
    }
    previousState() {
        window.history.back();
    }
}
