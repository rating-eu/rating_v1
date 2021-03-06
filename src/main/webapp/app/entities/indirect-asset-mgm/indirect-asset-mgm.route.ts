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
import { IndirectAssetMgmComponent } from './indirect-asset-mgm.component';
import { IndirectAssetMgmDetailComponent } from './indirect-asset-mgm-detail.component';
import { IndirectAssetMgmPopupComponent } from './indirect-asset-mgm-dialog.component';
import { IndirectAssetMgmDeletePopupComponent } from './indirect-asset-mgm-delete-dialog.component';

export const indirectAssetRoute: Routes = [
    {
        path: 'indirect-asset-mgm',
        component: IndirectAssetMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.indirectAsset.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'indirect-asset-mgm/:id',
        component: IndirectAssetMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.indirectAsset.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const indirectAssetPopupRoute: Routes = [
    {
        path: 'indirect-asset-mgm-new',
        component: IndirectAssetMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.indirectAsset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'indirect-asset-mgm/:id/edit',
        component: IndirectAssetMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.indirectAsset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'indirect-asset-mgm/:id/delete',
        component: IndirectAssetMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.indirectAsset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
