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
import { CompanyGroupMgmComponent } from './company-group-mgm.component';
import { CompanyGroupMgmDetailComponent } from './company-group-mgm-detail.component';
import { CompanyGroupMgmPopupComponent } from './company-group-mgm-dialog.component';
import { CompanyGroupMgmDeletePopupComponent } from './company-group-mgm-delete-dialog.component';

export const companyGroupRoute: Routes = [
    {
        path: 'company-group-mgm',
        component: CompanyGroupMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyGroup.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'company-group-mgm/:id',
        component: CompanyGroupMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyGroup.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const companyGroupPopupRoute: Routes = [
    {
        path: 'company-group-mgm-new',
        component: CompanyGroupMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyGroup.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company-group-mgm/:id/edit',
        component: CompanyGroupMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyGroup.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company-group-mgm/:id/delete',
        component: CompanyGroupMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyGroup.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
