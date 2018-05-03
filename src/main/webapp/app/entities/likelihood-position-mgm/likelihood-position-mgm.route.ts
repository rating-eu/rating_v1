import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LikelihoodPositionMgmComponent } from './likelihood-position-mgm.component';
import { LikelihoodPositionMgmDetailComponent } from './likelihood-position-mgm-detail.component';
import { LikelihoodPositionMgmPopupComponent } from './likelihood-position-mgm-dialog.component';
import { LikelihoodPositionMgmDeletePopupComponent } from './likelihood-position-mgm-delete-dialog.component';

export const likelihoodPositionRoute: Routes = [
    {
        path: 'likelihood-position-mgm',
        component: LikelihoodPositionMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodPosition.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'likelihood-position-mgm/:id',
        component: LikelihoodPositionMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodPosition.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const likelihoodPositionPopupRoute: Routes = [
    {
        path: 'likelihood-position-mgm-new',
        component: LikelihoodPositionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodPosition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'likelihood-position-mgm/:id/edit',
        component: LikelihoodPositionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodPosition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'likelihood-position-mgm/:id/delete',
        component: LikelihoodPositionMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodPosition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
