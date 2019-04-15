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
import { EBITMgmComponent } from './ebit-mgm.component';
import { EBITMgmDetailComponent } from './ebit-mgm-detail.component';
import { EBITMgmPopupComponent } from './ebit-mgm-dialog.component';
import { EBITMgmDeletePopupComponent } from './ebit-mgm-delete-dialog.component';

export const eBITRoute: Routes = [
    {
        path: 'ebit-mgm',
        component: EBITMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.eBIT.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'ebit-mgm/:id',
        component: EBITMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.eBIT.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const eBITPopupRoute: Routes = [
    {
        path: 'ebit-mgm-new',
        component: EBITMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.eBIT.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'ebit-mgm/:id/edit',
        component: EBITMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.eBIT.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'ebit-mgm/:id/delete',
        component: EBITMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.eBIT.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
