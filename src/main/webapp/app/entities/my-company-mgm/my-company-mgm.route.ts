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
import { MyCompanyMgmComponent } from './my-company-mgm.component';
import { MyCompanyMgmDetailComponent } from './my-company-mgm-detail.component';
import { MyCompanyMgmPopupComponent } from './my-company-mgm-dialog.component';
import { MyCompanyMgmDeletePopupComponent } from './my-company-mgm-delete-dialog.component';

export const myCompanyRoute: Routes = [
    {
        path: 'my-company-mgm',
        component: MyCompanyMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myCompany.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'my-company-mgm/:id',
        component: MyCompanyMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myCompany.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const myCompanyPopupRoute: Routes = [
    {
        path: 'my-company-mgm-new',
        component: MyCompanyMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myCompany.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-company-mgm/:id/edit',
        component: MyCompanyMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myCompany.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-company-mgm/:id/delete',
        component: MyCompanyMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myCompany.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
