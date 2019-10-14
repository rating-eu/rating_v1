import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { DataThreatMgmComponent } from './data-threat-mgm.component';
import { DataThreatMgmDetailComponent } from './data-threat-mgm-detail.component';
import { DataThreatMgmPopupComponent } from './data-threat-mgm-dialog.component';
import { DataThreatMgmDeletePopupComponent } from './data-threat-mgm-delete-dialog.component';

export const dataThreatRoute: Routes = [
    {
        path: 'data-threat-mgm',
        component: DataThreatMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataThreat.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'data-threat-mgm/:id',
        component: DataThreatMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataThreat.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const dataThreatPopupRoute: Routes = [
    {
        path: 'data-threat-mgm-new',
        component: DataThreatMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataThreat.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'data-threat-mgm/:id/edit',
        component: DataThreatMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataThreat.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'data-threat-mgm/:id/delete',
        component: DataThreatMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataThreat.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
