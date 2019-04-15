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
import { AssetMgmComponent } from './asset-mgm.component';
import { AssetMgmDetailComponent } from './asset-mgm-detail.component';
import { AssetMgmPopupComponent } from './asset-mgm-dialog.component';
import { AssetMgmDeletePopupComponent } from './asset-mgm-delete-dialog.component';

export const assetRoute: Routes = [
    {
        path: 'asset-mgm',
        component: AssetMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.asset.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'asset-mgm/:id',
        component: AssetMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.asset.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const assetPopupRoute: Routes = [
    {
        path: 'asset-mgm-new',
        component: AssetMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.asset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'asset-mgm/:id/edit',
        component: AssetMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.asset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'asset-mgm/:id/delete',
        component: AssetMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.asset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
