import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { OverallSecurityImpactMgmComponent } from './overall-security-impact-mgm.component';
import { OverallSecurityImpactMgmDetailComponent } from './overall-security-impact-mgm-detail.component';
import { OverallSecurityImpactMgmPopupComponent } from './overall-security-impact-mgm-dialog.component';
import { OverallSecurityImpactMgmDeletePopupComponent } from './overall-security-impact-mgm-delete-dialog.component';

export const overallSecurityImpactRoute: Routes = [
    {
        path: 'overall-security-impact-mgm',
        component: OverallSecurityImpactMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallSecurityImpact.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'overall-security-impact-mgm/:id',
        component: OverallSecurityImpactMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallSecurityImpact.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const overallSecurityImpactPopupRoute: Routes = [
    {
        path: 'overall-security-impact-mgm-new',
        component: OverallSecurityImpactMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallSecurityImpact.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'overall-security-impact-mgm/:id/edit',
        component: OverallSecurityImpactMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallSecurityImpact.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'overall-security-impact-mgm/:id/delete',
        component: OverallSecurityImpactMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.overallSecurityImpact.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
