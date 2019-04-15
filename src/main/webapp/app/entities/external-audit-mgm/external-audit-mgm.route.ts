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
import { ExternalAuditMgmComponent } from './external-audit-mgm.component';
import { ExternalAuditMgmDetailComponent } from './external-audit-mgm-detail.component';
import { ExternalAuditMgmPopupComponent } from './external-audit-mgm-dialog.component';
import { ExternalAuditMgmDeletePopupComponent } from './external-audit-mgm-delete-dialog.component';

export const externalAuditRoute: Routes = [
    {
        path: 'external-audit-mgm',
        component: ExternalAuditMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.externalAudit.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'external-audit-mgm/:id',
        component: ExternalAuditMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.externalAudit.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const externalAuditPopupRoute: Routes = [
    {
        path: 'external-audit-mgm-new',
        component: ExternalAuditMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.externalAudit.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'external-audit-mgm/:id/edit',
        component: ExternalAuditMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.externalAudit.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'external-audit-mgm/:id/delete',
        component: ExternalAuditMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.externalAudit.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
