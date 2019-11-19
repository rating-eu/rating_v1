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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QuestionnairesRoutingModule} from './questionnaires-routing.module';
import {QuestionnaireComponent} from './questionnaires/questionnaire/questionnaire.component';
import {QuestionnairesComponent} from './questionnaires/questionnaires.component';
import {DynamicFormComponent} from './questionnaires/questionnaire/dynamic-form/dynamic-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {IdentifyThreatAgentModule} from '../identify-threat-agent/identify-threat-agent.module';
import {DataSharingModule} from '../data-sharing/data-sharing.module';
import {EvaluateWeaknessModule} from '../evaluate-weakness/evaluate-weakness.module';
import {MaterialModule} from '../material/material.module';
import {PartialSubmitPopupService} from './questionnaires/questionnaire/partial-submit-dialog/partial-submit-popup.service';
import {PartialSubmitDialogComponent, PartialSubmitPopupComponent} from './questionnaires/questionnaire/partial-submit-dialog/partial-submit-dialog.component';
import {HermeneutSharedModule, JhiLanguageHelper} from '../shared';
import {JhiLanguageService} from 'ng-jhipster';
import {DtoModule} from '../dto/dto.module';
import {DashboardModule} from '../dashboard/dashboard.module';
import {KatexModule} from 'ng-katex';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        QuestionnairesRoutingModule,
        ReactiveFormsModule,
        IdentifyThreatAgentModule,
        EvaluateWeaknessModule,
        DataSharingModule,
        MaterialModule,
        DtoModule,
        DashboardModule,
        KatexModule
    ],
    declarations: [
        QuestionnairesComponent,
        QuestionnaireComponent,
        DynamicFormComponent,
        PartialSubmitDialogComponent,
        PartialSubmitPopupComponent
    ],
    entryComponents: [
        PartialSubmitDialogComponent,
        PartialSubmitPopupComponent
    ],
    exports: [
        QuestionnairesComponent,
        QuestionnaireComponent,
        MaterialModule
    ],
    providers: [
        PartialSubmitPopupService
    ]
})
export class QuestionnairesModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language
            .subscribe((languageKey: string) => {
                this.languageService.changeLanguage(languageKey);
            });
    }
}
