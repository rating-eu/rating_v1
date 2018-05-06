import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QuestionnairesRoutingModule} from './questionnaires-routing.module';
import {QuestionnaireComponent} from './questionnaires/questionnaire/questionnaire.component';
import {QuestionnairesComponent} from './questionnaires/questionnaires.component';
import {QuestionnairesService} from './questionnaires.service';
import {DynamicFormComponent} from './questionnaires/questionnaire/dynamic-form/dynamic-form.component';
import { QuestionComponent } from './questionnaires/questionnaire/dynamic-form/question/question.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        QuestionnairesRoutingModule,
        ReactiveFormsModule
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
