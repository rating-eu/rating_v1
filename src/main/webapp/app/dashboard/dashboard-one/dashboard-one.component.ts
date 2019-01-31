import {Component, OnInit} from '@angular/core';
import {Principal, LoginModalService} from '../../shared';
import {JhiEventManager} from 'ng-jhipster';
import {SelfAssessmentMgmService, SelfAssessmentMgm} from '../../entities/self-assessment-mgm';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-dashboard-one',
    templateUrl: './dashboard-one.component.html',
    styleUrls: ['dashboard-one.component.css']
})
export class DashboardOneComponent implements OnInit {
    private account: Account;
    private mySelf: SelfAssessmentMgm = {};

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private mySelfAssessmentService: SelfAssessmentMgmService
    ) {
    }

    ngOnInit() {
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }
}
