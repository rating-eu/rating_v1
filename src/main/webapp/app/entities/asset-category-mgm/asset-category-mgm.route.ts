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
