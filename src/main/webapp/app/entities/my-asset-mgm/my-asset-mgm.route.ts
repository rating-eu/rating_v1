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
