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

import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ThreatAgentMgmComponent } from './threat-agent-mgm.component';
import { ThreatAgentMgmDetailComponent } from './threat-agent-mgm-detail.component';
import { ThreatAgentMgmPopupComponent } from './threat-agent-mgm-dialog.component';
import { ThreatAgentMgmDeletePopupComponent } from './threat-agent-mgm-delete-dialog.component';

export const threatAgentRoute: Routes = [
    {
        path: 'threat-agent-mgm',
        component: ThreatAgentMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.threatAgent.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'threat-agent-mgm/:id',
        component: ThreatAgentMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.threatAgent.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const threatAgentPopupRoute: Routes = [
    {
        path: 'threat-agent-mgm-new',
        component: ThreatAgentMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.threatAgent.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'threat-agent-mgm/:id/edit',
        component: ThreatAgentMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.threatAgent.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'threat-agent-mgm/:id/delete',
        component: ThreatAgentMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.threatAgent.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
