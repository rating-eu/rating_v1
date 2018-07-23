import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RefinementComponent} from './refinement/refinement.component';

const routes: Routes = [
    {
        path: '',
        component: RefinementComponent,
        children: [
            {
                path: 'questionnaires/:purpose',
                loadChildren: '../questionnaires/questionnaires.module#QuestionnairesModule'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExternalAuditRoutingModule {
}
