import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { OverallDataRiskMgmComponent } from './overall-data-risk-mgm.component';
import { OverallDataRiskMgmDetailComponent } from './overall-data-risk-mgm-detail.component';
import { OverallDataRiskMgmPopupComponent } from './overall-data-risk-mgm-dialog.component';
import { OverallDataRiskMgmDeletePopupComponent } from './overall-data-risk-mgm-delete-dialog.component';

export const overallDataRiskRoute: Routes = [
    {
        path: 'overall-data-risk-mgm',
        component: OverallDataRiskMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallDataRisk.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'overall-data-risk-mgm/:id',
        component: OverallDataRiskMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallDataRisk.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const overallDataRiskPopupRoute: Routes = [
    {
        path: 'overall-data-risk-mgm-new',
        component: OverallDataRiskMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallDataRisk.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'overall-data-risk-mgm/:id/edit',
        component: OverallDataRiskMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallDataRisk.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'overall-data-risk-mgm/:id/delete',
        component: OverallDataRiskMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallDataRisk.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
