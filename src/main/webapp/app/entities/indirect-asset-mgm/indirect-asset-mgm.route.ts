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
