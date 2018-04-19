import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QuestionnairesRoutingModule} from './questionnaires-routing.module';
import {IdTaComponent} from './id-ta/id-ta.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';

@NgModule({
    imports: [
        CommonModule,
        QuestionnairesRoutingModule
    ],
    declarations: [
        IdTaComponent,
        QuestionnaireComponent
    ],
    exports: [
        IdTaComponent
    ]
})
export class QuestionnairesModule {
}
