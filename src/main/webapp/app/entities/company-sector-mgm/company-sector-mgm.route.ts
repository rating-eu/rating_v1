import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { CompanySectorMgmComponent } from './company-sector-mgm.component';
import { CompanySectorMgmDetailComponent } from './company-sector-mgm-detail.component';
import { CompanySectorMgmPopupComponent } from './company-sector-mgm-dialog.component';
import { CompanySectorMgmDeletePopupComponent } from './company-sector-mgm-delete-dialog.component';

export const companySectorRoute: Routes = [
    {
        path: 'company-sector-mgm',
        component: CompanySectorMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companySector.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'company-sector-mgm/:id',
        component: CompanySectorMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companySector.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const companySectorPopupRoute: Routes = [
    {
        path: 'company-sector-mgm-new',
        component: CompanySectorMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companySector.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company-sector-mgm/:id/edit',
        component: CompanySectorMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companySector.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company-sector-mgm/:id/delete',
        component: CompanySectorMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companySector.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
