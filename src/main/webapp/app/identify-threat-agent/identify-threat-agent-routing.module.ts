import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IdentifyThreatAgentComponent} from './identify-threat-agent.component';
import {ThreatResultComponent} from './result/result.component';

const routes: Routes = [
    {
        path: '',
        component: IdentifyThreatAgentComponent,
        data: {
            pageTitle: 'hermeneutApp.identifyThreatAgent.page.root.title'
        },
        children: [
            {
                path: 'questionnaires/:purpose',
                loadChildren: '../questionnaires/questionnaires.module#QuestionnairesModule',
                data: {
                    pageTitle: 'hermeneutApp.identifyThreatAgent.page.questionnaires.title'
                }
            },
            {
                path: 'result/:statusID',
                component: ThreatResultComponent,
                data: {
                    pageTitle: 'hermeneutApp.identifyThreatAgent.page.result.title'
                }
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
