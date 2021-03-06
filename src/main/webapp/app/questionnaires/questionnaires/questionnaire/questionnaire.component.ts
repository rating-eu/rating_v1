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
import {QuestionnairesService} from '../../questionnaires.service';
import {QuestionnaireMgm} from '../../../entities/questionnaire-mgm';
import {DatasharingService} from '../../../datasharing/datasharing.service';
import {Router} from '@angular/router';
import {LocalStorageService} from 'ngx-webstorage';
import {QuestionnairePurpose} from '../../../entities/enumerations/QuestionnairePurpose.enum';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../../entities/self-assessment-mgm';
import {AccountService, User, UserService} from '../../../shared';

@Component({
    selector: 'jhi-questionnaire',
    templateUrl: './questionnaire.component.html',
    styles: [],
})
export class QuestionnaireComponent implements OnInit {

    questionnaire: QuestionnaireMgm;
    purpose: QuestionnairePurpose;
    selfAssessment: SelfAssessmentMgm;
    account: Account;
    user: User;

    constructor(
        private questionnairesService: QuestionnairesService,
        private dataSharingService: DatasharingService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private accountService: AccountService,
        private userService: UserService,
        private router: Router,
        private localStorage: LocalStorageService) {
    }

    ngOnInit() {
        this.questionnaire = this.dataSharingService.currentQuestionnaire;
        this.purpose = this.localStorage.retrieve('purpose') as QuestionnairePurpose;
    }
}
