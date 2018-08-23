import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { EBITMgmComponent } from './ebit-mgm.component';
import { EBITMgmDetailComponent } from './ebit-mgm-detail.component';
import { EBITMgmPopupComponent } from './ebit-mgm-dialog.component';
import { EBITMgmDeletePopupComponent } from './ebit-mgm-delete-dialog.component';

export const eBITRoute: Routes = [
    {
        path: 'ebit-mgm',
        component: EBITMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.eBIT.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'ebit-mgm/:id',
        component: EBITMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.eBIT.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const eBITPopupRoute: Routes = [
    {
        path: 'ebit-mgm-new',
        component: EBITMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.eBIT.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'ebit-mgm/:id/edit',
        component: EBITMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.eBIT.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'ebit-mgm/:id/delete',
        component: EBITMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.eBIT.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
