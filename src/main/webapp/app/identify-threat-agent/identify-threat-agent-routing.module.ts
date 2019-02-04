import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IdentifyThreatAgentComponent} from './identify-threat-agent.component';
import {ThreatResultComponent} from './result/result.component';
import { UserRouteAccessService } from '../shared';

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
                    pageTitle: 'hermeneutApp.identifyThreatAgent.page.questionnaires.title',
                    authorities: ['ROLE_CISO'],
                },
                canActivate: [UserRouteAccessService]
            },
            {
                path: 'result',
                component: ThreatResultComponent,
                data: {
                    pageTitle: 'hermeneutApp.identifyThreatAgent.page.result.title',
                    authorities: ['ROLE_CISO'],
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

export class IdentifyThreatAgentRoutingModule {
}
