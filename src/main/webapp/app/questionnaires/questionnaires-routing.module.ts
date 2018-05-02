import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {QuestionnaireComponent} from './questionnaires/questionnaire/questionnaire.component';
import {QuestionnairesComponent} from './questionnaires/questionnaires.component';

const routes: Routes = [
    {path: '', component: QuestionnairesComponent},
    {path: 'questionnaire', component: QuestionnaireComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class QuestionnairesRoutingModule {
}
