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
import { DirectAssetMgmComponent } from './direct-asset-mgm.component';
import { DirectAssetMgmDetailComponent } from './direct-asset-mgm-detail.component';
import { DirectAssetMgmPopupComponent } from './direct-asset-mgm-dialog.component';
import { DirectAssetMgmDeletePopupComponent } from './direct-asset-mgm-delete-dialog.component';

export const directAssetRoute: Routes = [
    {
        path: 'direct-asset-mgm',
        component: DirectAssetMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.directAsset.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'direct-asset-mgm/:id',
        component: DirectAssetMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.directAsset.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const directAssetPopupRoute: Routes = [
    {
        path: 'direct-asset-mgm-new',
        component: DirectAssetMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.directAsset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'direct-asset-mgm/:id/edit',
        component: DirectAssetMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.directAsset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'direct-asset-mgm/:id/delete',
        component: DirectAssetMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.directAsset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
