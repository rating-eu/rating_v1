import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SplittingLossMgmComponent } from './splitting-loss-mgm.component';
import { SplittingLossMgmDetailComponent } from './splitting-loss-mgm-detail.component';
import { SplittingLossMgmPopupComponent } from './splitting-loss-mgm-dialog.component';
import { SplittingLossMgmDeletePopupComponent } from './splitting-loss-mgm-delete-dialog.component';

export const splittingLossRoute: Routes = [
    {
        path: 'splitting-loss-mgm',
        component: SplittingLossMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingLoss.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'splitting-loss-mgm/:id',
        component: SplittingLossMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingLoss.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const splittingLossPopupRoute: Routes = [
    {
        path: 'splitting-loss-mgm-new',
        component: SplittingLossMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingLoss.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'splitting-loss-mgm/:id/edit',
        component: SplittingLossMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingLoss.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'splitting-loss-mgm/:id/delete',
        component: SplittingLossMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingLoss.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
