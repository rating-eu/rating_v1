import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IdentifyThreatAgentComponent} from './identify-threat-agent.component';
import {ThreatResultComponent} from './result/result.component';

const routes: Routes = [
    {
        path: '',
        component: IdentifyThreatAgentComponent,
        children: [
            {
                path: 'questionnaires/:purpose',
                loadChildren: '../questionnaires/questionnaires.module#QuestionnairesModule'
            },
            {
                path: 'result/:statusID',
                component: ThreatResultComponent
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

export class IdentifyThreatAgentRoutingModule {
}
