import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PhaseMgmComponent } from './phase-mgm.component';
import { PhaseMgmDetailComponent } from './phase-mgm-detail.component';
import { PhaseMgmPopupComponent } from './phase-mgm-dialog.component';
import { PhaseMgmDeletePopupComponent } from './phase-mgm-delete-dialog.component';

export const phaseRoute: Routes = [
    {
        path: 'phase-mgm',
        component: PhaseMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.phase.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'phase-mgm/:id',
        component: PhaseMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.phase.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const phasePopupRoute: Routes = [
    {
        path: 'phase-mgm-new',
        component: PhaseMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.phase.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'phase-mgm/:id/edit',
        component: PhaseMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.phase.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'phase-mgm/:id/delete',
        component: PhaseMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.phase.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
