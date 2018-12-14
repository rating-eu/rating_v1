import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LogoMgmComponent } from './logo-mgm.component';
import { LogoMgmDetailComponent } from './logo-mgm-detail.component';
import { LogoMgmPopupComponent } from './logo-mgm-dialog.component';
import { LogoMgmDeletePopupComponent } from './logo-mgm-delete-dialog.component';

export const logoRoute: Routes = [
    {
        path: 'logo-mgm',
        component: LogoMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.logo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'logo-mgm/:id',
        component: LogoMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.logo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const logoPopupRoute: Routes = [
    {
        path: 'logo-mgm-new',
        component: LogoMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.logo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'logo-mgm/:id/edit',
        component: LogoMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.logo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'logo-mgm/:id/delete',
        component: LogoMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.logo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
