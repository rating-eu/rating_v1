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
import { LogoMgmComponent } from './logo-mgm.component';
import { LogoMgmDetailComponent } from './logo-mgm-detail.component';
import { LogoMgmPopupComponent } from './logo-mgm-dialog.component';
import { LogoMgmDeletePopupComponent } from './logo-mgm-delete-dialog.component';

export const logoRoute: Routes = [
    {
        path: 'logo-mgm',
        component: LogoMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.logo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'logo-mgm/:id',
        component: LogoMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.logo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const logoPopupRoute: Routes = [
    {
        path: 'logo-mgm-new',
        component: LogoMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.logo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'logo-mgm/:id/edit',
        component: LogoMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.logo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'logo-mgm/:id/delete',
        component: LogoMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.logo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
