import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {Account, LoginModalService, Principal} from '../shared';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {DatasharingService} from '../datasharing/datasharing.service';
import {MyRole} from '../entities/enumerations/MyRole.enum';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.css'
    ]

})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    mySelf: SelfAssessmentMgm = {};

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private router: Router,
        private dataSharingService: DatasharingService
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();

        const role: MyRole = this.dataSharingService.getRole();

        if (role) {
            switch (role) {
                case MyRole.ROLE_CISO: {
                    this.router.navigate(['/dashboard']);
                    break;
                }
                case MyRole.ROLE_EXTERNAL_AUDIT: {
                    this.router.navigate(['/my-self-assessments']);
                    break;
                }
            }
        }
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

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
