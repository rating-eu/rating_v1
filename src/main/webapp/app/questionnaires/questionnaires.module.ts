import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QuestionnairesRoutingModule} from './questionnaires-routing.module';
import {QuestionnaireComponent} from './questionnaires/questionnaire/questionnaire.component';
import {QuestionnairesComponent} from './questionnaires/questionnaires.component';
import {QuestionnairesService} from './questionnaires.service';

@NgModule({
    imports: [
        CommonModule,
        QuestionnairesRoutingModule
    ],
    declarations: [
        QuestionnairesComponent,
        QuestionnaireComponent
    ],
    exports: [
        QuestionnairesComponent,
        QuestionnaireComponent
    ]
})
export class QuestionnairesModule {
}
