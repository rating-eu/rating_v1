import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { DataOperationMgmComponent } from './data-operation-mgm.component';
import { DataOperationMgmDetailComponent } from './data-operation-mgm-detail.component';
import { DataOperationMgmPopupComponent } from './data-operation-mgm-dialog.component';
import { DataOperationMgmDeletePopupComponent } from './data-operation-mgm-delete-dialog.component';

export const dataOperationRoute: Routes = [
    {
        path: 'data-operation-mgm',
        component: DataOperationMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataOperation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'data-operation-mgm/:id',
        component: DataOperationMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataOperation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const dataOperationPopupRoute: Routes = [
    {
        path: 'data-operation-mgm-new',
        component: DataOperationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataOperation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'data-operation-mgm/:id/edit',
        component: DataOperationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataOperation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'data-operation-mgm/:id/delete',
        component: DataOperationMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataOperation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
