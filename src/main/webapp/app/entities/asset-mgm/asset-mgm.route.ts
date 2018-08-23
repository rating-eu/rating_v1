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
