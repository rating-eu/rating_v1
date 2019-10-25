import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { SystemConfigMgmComponent } from './system-config-mgm.component';
import { SystemConfigMgmDetailComponent } from './system-config-mgm-detail.component';
import { SystemConfigMgmPopupComponent } from './system-config-mgm-dialog.component';
import { SystemConfigMgmDeletePopupComponent } from './system-config-mgm-delete-dialog.component';

export const systemConfigRoute: Routes = [
    {
        path: 'system-config-mgm',
        component: SystemConfigMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.systemConfig.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'system-config-mgm/:id',
        component: SystemConfigMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.systemConfig.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const systemConfigPopupRoute: Routes = [
    {
        path: 'system-config-mgm-new',
        component: SystemConfigMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.systemConfig.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'system-config-mgm/:id/edit',
        component: SystemConfigMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.systemConfig.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'system-config-mgm/:id/delete',
        component: SystemConfigMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.systemConfig.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
