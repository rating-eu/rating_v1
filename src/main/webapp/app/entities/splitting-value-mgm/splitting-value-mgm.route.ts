import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SplittingValueMgmComponent } from './splitting-value-mgm.component';
import { SplittingValueMgmDetailComponent } from './splitting-value-mgm-detail.component';
import { SplittingValueMgmPopupComponent } from './splitting-value-mgm-dialog.component';
import { SplittingValueMgmDeletePopupComponent } from './splitting-value-mgm-delete-dialog.component';

export const splittingValueRoute: Routes = [
    {
        path: 'splitting-value-mgm',
        component: SplittingValueMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingValue.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'splitting-value-mgm/:id',
        component: SplittingValueMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingValue.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const splittingValuePopupRoute: Routes = [
    {
        path: 'splitting-value-mgm-new',
        component: SplittingValueMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingValue.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'splitting-value-mgm/:id/edit',
        component: SplittingValueMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingValue.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'splitting-value-mgm/:id/delete',
        component: SplittingValueMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingValue.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
