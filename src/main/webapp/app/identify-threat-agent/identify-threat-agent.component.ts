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
import {JhiEventManager, JhiLanguageService} from 'ng-jhipster';
import {JhiLanguageHelper, LoginModalService, Principal} from '../shared';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';

@Component({
    selector: 'jhi-identify-threat-agent',
    templateUrl: './identify-threat-agent.component.html',
    styleUrls: [
      'identify-threat-agent.css'
    ]
})
export class IdentifyThreatAgentComponent implements OnInit {
    account: Account;
    mySelf: SelfAssessmentMgm = {};

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper
    ) {
    }

    ngOnInit() {
        // this.principal.identity().then((account) => {
        //     this.account = account;
        // });
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();

    }

    previousState() {
        window.history.back();
    }
}
