import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { MitigationMgmComponent } from './mitigation-mgm.component';
import { MitigationMgmDetailComponent } from './mitigation-mgm-detail.component';
import { MitigationMgmPopupComponent } from './mitigation-mgm-dialog.component';
import { MitigationMgmDeletePopupComponent } from './mitigation-mgm-delete-dialog.component';

export const mitigationRoute: Routes = [
    {
        path: 'mitigation-mgm',
        component: MitigationMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.mitigation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'mitigation-mgm/:id',
        component: MitigationMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.mitigation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const mitigationPopupRoute: Routes = [
    {
        path: 'mitigation-mgm-new',
        component: MitigationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.mitigation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'mitigation-mgm/:id/edit',
        component: MitigationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.mitigation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'mitigation-mgm/:id/delete',
        component: MitigationMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.mitigation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
