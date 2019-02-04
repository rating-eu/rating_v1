import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EvaluateWeaknessComponent} from './evaluate-weakness.component';
import {WeaknessResultComponent} from './result/result.component';
import { UserRouteAccessService } from '../shared';

const routes: Routes = [
    {
        path: '',
        component: EvaluateWeaknessComponent,
        children: [
            {
                path: 'questionnaires/:purpose',
                loadChildren: '../questionnaires/questionnaires.module#QuestionnairesModule',
                data: {
                    authorities: ['ROLE_CISO', 'ROLE_EXTERNAL_AUDIT'],
                },
                canActivate: [UserRouteAccessService]
            },
            {
                path: 'result',
                component: WeaknessResultComponent,
                data: {
                    authorities: ['ROLE_CISO', 'ROLE_EXTERNAL_AUDIT'],
                },
                canActivate: [UserRouteAccessService]
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class EvaluateWeaknessRoutingModule {
}
