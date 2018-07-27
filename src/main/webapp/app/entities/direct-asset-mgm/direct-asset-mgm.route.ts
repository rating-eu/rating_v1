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
