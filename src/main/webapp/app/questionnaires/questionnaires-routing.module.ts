import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IdTaComponent} from './id-ta/id-ta.component'

const routes: Routes = [
    {path: 'questionnaires/id-ta', component: IdTaComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuestionnairesRoutingModule {
}
