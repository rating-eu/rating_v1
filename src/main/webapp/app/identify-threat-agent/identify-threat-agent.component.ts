import { Component, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import {LoginModalService, Principal} from '../shared';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';

@Component({
    selector: 'jhi-identify-threat-agent',
    templateUrl: './identify-threat-agent.component.html'
})
export class IdentifyThreatAgentComponent implements OnInit {
    account: Account;
    mySelf: SelfAssessmentMgm = {};

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private mySelfAssessmentService: SelfAssessmentMgmService
    ) {}

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();

    }
    previousState() {
        window.history.back();
    }
}
