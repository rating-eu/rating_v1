import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { OverallDataThreatMgmComponent } from './overall-data-threat-mgm.component';
import { OverallDataThreatMgmDetailComponent } from './overall-data-threat-mgm-detail.component';
import { OverallDataThreatMgmPopupComponent } from './overall-data-threat-mgm-dialog.component';
import { OverallDataThreatMgmDeletePopupComponent } from './overall-data-threat-mgm-delete-dialog.component';

export const overallDataThreatRoute: Routes = [
    {
        path: 'overall-data-threat-mgm',
        component: OverallDataThreatMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallDataThreat.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'overall-data-threat-mgm/:id',
        component: OverallDataThreatMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallDataThreat.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const overallDataThreatPopupRoute: Routes = [
    {
        path: 'overall-data-threat-mgm-new',
        component: OverallDataThreatMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallDataThreat.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'overall-data-threat-mgm/:id/edit',
        component: OverallDataThreatMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallDataThreat.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'overall-data-threat-mgm/:id/delete',
        component: OverallDataThreatMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallDataThreat.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
