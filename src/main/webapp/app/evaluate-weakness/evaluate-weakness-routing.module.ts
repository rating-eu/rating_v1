import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EvaluateWeaknessComponent} from './evaluate-weakness.component';
import {WeaknessResultComponent} from './result/result.component';

const routes: Routes = [
    {
        path: '',
        component: EvaluateWeaknessComponent,
        children: [
            {
                path: 'questionnaires/:purpose',
                loadChildren: '../questionnaires/questionnaires.module#QuestionnairesModule'
            },
            {
                path: 'result/:statusID',
                component: WeaknessResultComponent
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
