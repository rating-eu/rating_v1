import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IdTaComponent} from './id-ta/id-ta.component';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';

const routes: Routes = [
    {path: '', component: IdTaComponent},
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
