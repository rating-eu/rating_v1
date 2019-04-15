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
import { MitigationMgmComponent } from './mitigation-mgm.component';
import { MitigationMgmDetailComponent } from './mitigation-mgm-detail.component';
import { MitigationMgmPopupComponent } from './mitigation-mgm-dialog.component';
import { MitigationMgmDeletePopupComponent } from './mitigation-mgm-delete-dialog.component';

export const mitigationRoute: Routes = [
    {
        path: 'mitigation-mgm',
        component: MitigationMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.mitigation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'mitigation-mgm/:id',
        component: MitigationMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.mitigation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const mitigationPopupRoute: Routes = [
    {
        path: 'mitigation-mgm-new',
        component: MitigationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.mitigation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'mitigation-mgm/:id/edit',
        component: MitigationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.mitigation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'mitigation-mgm/:id/delete',
        component: MitigationMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.mitigation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
