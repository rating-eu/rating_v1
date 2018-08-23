import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LikelihoodScaleMgmComponent } from './likelihood-scale-mgm.component';
import { LikelihoodScaleMgmDetailComponent } from './likelihood-scale-mgm-detail.component';
import { LikelihoodScaleMgmPopupComponent } from './likelihood-scale-mgm-dialog.component';
import { LikelihoodScaleMgmDeletePopupComponent } from './likelihood-scale-mgm-delete-dialog.component';

export const likelihoodScaleRoute: Routes = [
    {
        path: 'likelihood-scale-mgm',
        component: LikelihoodScaleMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodScale.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'likelihood-scale-mgm/:id',
        component: LikelihoodScaleMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodScale.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const likelihoodScalePopupRoute: Routes = [
    {
        path: 'likelihood-scale-mgm-new',
        component: LikelihoodScaleMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodScale.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'likelihood-scale-mgm/:id/edit',
        component: LikelihoodScaleMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodScale.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'likelihood-scale-mgm/:id/delete',
        component: LikelihoodScaleMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodScale.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
