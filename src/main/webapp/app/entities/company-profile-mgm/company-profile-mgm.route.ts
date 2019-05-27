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
import { CompanyProfileMgmComponent } from './company-profile-mgm.component';
import { CompanyProfileMgmDetailComponent } from './company-profile-mgm-detail.component';
import { CompanyProfileMgmPopupComponent } from './company-profile-mgm-dialog.component';
import { CompanyProfileMgmDeletePopupComponent } from './company-profile-mgm-delete-dialog.component';

export const companyProfileRoute: Routes = [
    {
        path: 'company-profile-mgm',
        component: CompanyProfileMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyProfile.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'company-profile-mgm/:id',
        component: CompanyProfileMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyProfile.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const companyProfilePopupRoute: Routes = [
    {
        path: 'company-profile-mgm-new',
        component: CompanyProfileMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyProfile.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company-profile-mgm/:id/edit',
        component: CompanyProfileMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyProfile.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company-profile-mgm/:id/delete',
        component: CompanyProfileMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyProfile.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
