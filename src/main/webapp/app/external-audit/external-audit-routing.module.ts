import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RefinementComponent} from './refinement/refinement.component';
import { UserRouteAccessService } from '../shared';

const routes: Routes = [
    {
        path: '',
        component: RefinementComponent,
        children: [
            {
                path: 'questionnaires/:purpose',
                loadChildren: '../questionnaires/questionnaires.module#QuestionnairesModule',
                data: {
                    authorities: ['ROLE_EXTERNAL'],
                },
                canActivate: [UserRouteAccessService]
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
