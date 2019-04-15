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
import { MyAssetMgmComponent } from './my-asset-mgm.component';
import { MyAssetMgmDetailComponent } from './my-asset-mgm-detail.component';
import { MyAssetMgmPopupComponent } from './my-asset-mgm-dialog.component';
import { MyAssetMgmDeletePopupComponent } from './my-asset-mgm-delete-dialog.component';

export const myAssetRoute: Routes = [
    {
        path: 'my-asset-mgm',
        component: MyAssetMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAsset.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'my-asset-mgm/:id',
        component: MyAssetMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAsset.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const myAssetPopupRoute: Routes = [
    {
        path: 'my-asset-mgm-new',
        component: MyAssetMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAsset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-asset-mgm/:id/edit',
        component: MyAssetMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAsset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-asset-mgm/:id/delete',
        component: MyAssetMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAsset.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
