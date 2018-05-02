import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IdentifyThreatAgentComponent} from './identify-threat-agent.component';
import {QuestionnairesComponent} from '../questionnaires/questionnaires/questionnaires.component';

const routes: Routes = [
    {
        path: '',
        component: IdentifyThreatAgentComponent,
        children: [
            {
                path: 'questionnaires',
                loadChildren: '../questionnaires/questionnaires.module#QuestionnairesModule'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule
    ]
})

export class IdentifyThreatAgentRoutingModule {
}
