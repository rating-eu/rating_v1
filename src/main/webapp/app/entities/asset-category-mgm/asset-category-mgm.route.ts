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
import { AssetCategoryMgmComponent } from './asset-category-mgm.component';
import { AssetCategoryMgmDetailComponent } from './asset-category-mgm-detail.component';
import { AssetCategoryMgmPopupComponent } from './asset-category-mgm-dialog.component';
import { AssetCategoryMgmDeletePopupComponent } from './asset-category-mgm-delete-dialog.component';

export const assetCategoryRoute: Routes = [
    {
        path: 'asset-category-mgm',
        component: AssetCategoryMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.assetCategory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'asset-category-mgm/:id',
        component: AssetCategoryMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.assetCategory.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const assetCategoryPopupRoute: Routes = [
    {
        path: 'asset-category-mgm-new',
        component: AssetCategoryMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.assetCategory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'asset-category-mgm/:id/edit',
        component: AssetCategoryMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.assetCategory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'asset-category-mgm/:id/delete',
        component: AssetCategoryMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.assetCategory.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
