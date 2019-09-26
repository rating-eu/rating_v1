/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {Account, LoginModalService, Principal} from '../shared';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {DataSharingService} from '../data-sharing/data-sharing.service';
import {Role} from '../entities/enumerations/Role.enum';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.css'
    ]
})
export class HomeComponent implements OnInit {
    account: Account;
    role: Role;

    modalRef: NgbModalRef;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private router: Router,
        private dataSharingService: DataSharingService
    ) {
    }

    ngOnInit() {
        /*this.principal.identity().then((account) => {
            this.account = account;
            this.dataSharingService.account = this.account;
        });*/
        this.registerAuthenticationSuccess();

        this.role = this.dataSharingService.role;
        this.checkRole();

        this.dataSharingService.role$.subscribe((response: Role) => {
            this.role = response;
            this.checkRole();
        });
    }

    private checkRole() {
        if (this.role) {
            switch (this.role) {
                case Role.ROLE_CISO: {
                    this.router.navigate(['/dashboard']);
                    break;
                }
                case Role.ROLE_EXTERNAL_AUDIT: {
                    this.router.navigate(['/evaluate-weakness/questionnaires/SELFASSESSMENT']);
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
