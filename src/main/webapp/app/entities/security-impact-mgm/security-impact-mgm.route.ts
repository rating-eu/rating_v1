import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SecurityImpactMgmComponent } from './security-impact-mgm.component';
import { SecurityImpactMgmDetailComponent } from './security-impact-mgm-detail.component';
import { SecurityImpactMgmPopupComponent } from './security-impact-mgm-dialog.component';
import { SecurityImpactMgmDeletePopupComponent } from './security-impact-mgm-delete-dialog.component';

export const securityImpactRoute: Routes = [
    {
        path: 'security-impact-mgm',
        component: SecurityImpactMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.securityImpact.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'security-impact-mgm/:id',
        component: SecurityImpactMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.securityImpact.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const securityImpactPopupRoute: Routes = [
    {
        path: 'security-impact-mgm-new',
        component: SecurityImpactMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.securityImpact.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'security-impact-mgm/:id/edit',
        component: SecurityImpactMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.securityImpact.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'security-impact-mgm/:id/delete',
        component: SecurityImpactMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.securityImpact.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
