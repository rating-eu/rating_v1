import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PhaseWrapperMgmComponent } from './phase-wrapper-mgm.component';
import { PhaseWrapperMgmDetailComponent } from './phase-wrapper-mgm-detail.component';
import { PhaseWrapperMgmPopupComponent } from './phase-wrapper-mgm-dialog.component';
import { PhaseWrapperMgmDeletePopupComponent } from './phase-wrapper-mgm-delete-dialog.component';

export const phaseWrapperRoute: Routes = [
    {
        path: 'phase-wrapper-mgm',
        component: PhaseWrapperMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.phaseWrapper.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'phase-wrapper-mgm/:id',
        component: PhaseWrapperMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.phaseWrapper.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const phaseWrapperPopupRoute: Routes = [
    {
        path: 'phase-wrapper-mgm-new',
        component: PhaseWrapperMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.phaseWrapper.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'phase-wrapper-mgm/:id/edit',
        component: PhaseWrapperMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.phaseWrapper.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'phase-wrapper-mgm/:id/delete',
        component: PhaseWrapperMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.phaseWrapper.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
