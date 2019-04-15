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
import { ContainerMgmComponent } from './container-mgm.component';
import { ContainerMgmDetailComponent } from './container-mgm-detail.component';
import { ContainerMgmPopupComponent } from './container-mgm-dialog.component';
import { ContainerMgmDeletePopupComponent } from './container-mgm-delete-dialog.component';

export const containerRoute: Routes = [
    {
        path: 'container-mgm',
        component: ContainerMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.container.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'container-mgm/:id',
        component: ContainerMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.container.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const containerPopupRoute: Routes = [
    {
        path: 'container-mgm-new',
        component: ContainerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.container.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'container-mgm/:id/edit',
        component: ContainerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.container.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'container-mgm/:id/delete',
        component: ContainerMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.container.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
