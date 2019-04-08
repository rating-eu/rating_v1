import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QuestionnairesRoutingModule} from './questionnaires-routing.module';
import {QuestionnaireComponent} from './questionnaires/questionnaire/questionnaire.component';
import {QuestionnairesComponent} from './questionnaires/questionnaires.component';
import {DynamicFormComponent} from './questionnaires/questionnaire/dynamic-form/dynamic-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {IdentifyThreatAgentModule} from '../identify-threat-agent/identify-threat-agent.module';
import {DatasharingModule} from '../datasharing/datasharing.module';
import {EvaluateWeaknessModule} from '../evaluate-weakness/evaluate-weakness.module';
import {MaterialModule} from '../material/material.module';
import {PartialSubmitPopupService} from './questionnaires/questionnaire/partial-submit-dialog/partial-submit-popup.service';
import {PartialSubmitDialogComponent, PartialSubmitPopupComponent} from './questionnaires/questionnaire/partial-submit-dialog/partial-submit-dialog.component';
import {HermeneutSharedModule, JhiLanguageHelper} from '../shared';
import {JhiLanguageService} from 'ng-jhipster';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        QuestionnairesRoutingModule,
        ReactiveFormsModule,
        IdentifyThreatAgentModule,
        EvaluateWeaknessModule,
        DatasharingModule,
        MaterialModule
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
