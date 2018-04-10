import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ExternalAuditMgmComponent } from './external-audit-mgm.component';
import { ExternalAuditMgmDetailComponent } from './external-audit-mgm-detail.component';
import { ExternalAuditMgmPopupComponent } from './external-audit-mgm-dialog.component';
import { ExternalAuditMgmDeletePopupComponent } from './external-audit-mgm-delete-dialog.component';

export const externalAuditRoute: Routes = [
    {
        path: 'external-audit-mgm',
        component: ExternalAuditMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.externalAudit.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'external-audit-mgm/:id',
        component: ExternalAuditMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.externalAudit.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const externalAuditPopupRoute: Routes = [
    {
        path: 'external-audit-mgm-new',
        component: ExternalAuditMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.externalAudit.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'external-audit-mgm/:id/edit',
        component: ExternalAuditMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.externalAudit.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'external-audit-mgm/:id/delete',
        component: ExternalAuditMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.externalAudit.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
