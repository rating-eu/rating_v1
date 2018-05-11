import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QuestionnairesRoutingModule} from './questionnaires-routing.module';
import {QuestionnaireComponent} from './questionnaires/questionnaire/questionnaire.component';
import {QuestionnairesComponent} from './questionnaires/questionnaires.component';
import {DynamicFormComponent} from './questionnaires/questionnaire/dynamic-form/dynamic-form.component';
import {QuestionComponent} from './questionnaires/questionnaire/dynamic-form/question/question.component';
import {ReactiveFormsModule} from '@angular/forms';
import {IdentifyThreatAgentModule} from '../identify-threat-agent/identify-threat-agent.module';
import {DatasharingModule} from '../datasharing/datasharing.module';

@NgModule({
    imports: [
        CommonModule,
        QuestionnairesRoutingModule,
        ReactiveFormsModule,
        IdentifyThreatAgentModule,
        DatasharingModule
    ],
    declarations: [
        QuestionnairesComponent,
        QuestionnaireComponent,
        DynamicFormComponent,
        QuestionComponent
    ],
    exports: [
        QuestionnairesComponent,
        QuestionnaireComponent
    ]
})
export class QuestionnairesModule {
}
