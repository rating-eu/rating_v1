/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
