import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { CriticalLevelMgmComponent } from './critical-level-mgm.component';
import { CriticalLevelMgmDetailComponent } from './critical-level-mgm-detail.component';
import { CriticalLevelMgmPopupComponent } from './critical-level-mgm-dialog.component';
import { CriticalLevelMgmDeletePopupComponent } from './critical-level-mgm-delete-dialog.component';

export const criticalLevelRoute: Routes = [
    {
        path: 'critical-level-mgm',
        component: CriticalLevelMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.criticalLevel.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'critical-level-mgm/:id',
        component: CriticalLevelMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.criticalLevel.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const criticalLevelPopupRoute: Routes = [
    {
        path: 'critical-level-mgm-new',
        component: CriticalLevelMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.criticalLevel.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'critical-level-mgm/:id/edit',
        component: CriticalLevelMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.criticalLevel.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'critical-level-mgm/:id/delete',
        component: CriticalLevelMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.criticalLevel.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
