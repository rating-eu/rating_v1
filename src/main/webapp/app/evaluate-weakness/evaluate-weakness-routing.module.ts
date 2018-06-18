import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EvaluateWeaknessComponent} from './evaluate-weakness.component';
import {ResultComponent} from './result/result.component';

const routes: Routes = [
    {
        path: '', component: EvaluateWeaknessComponent,
        children: [
            {
                path: 'questionnaires/:purpose',
                loadChildren: '../questionnaires/questionnaires.module#QuestionnairesModule'
            },
            {
                path: 'result',
                component: ResultComponent
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
