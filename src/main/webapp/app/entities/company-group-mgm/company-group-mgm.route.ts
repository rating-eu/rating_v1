import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { CompanyGroupMgmComponent } from './company-group-mgm.component';
import { CompanyGroupMgmDetailComponent } from './company-group-mgm-detail.component';
import { CompanyGroupMgmPopupComponent } from './company-group-mgm-dialog.component';
import { CompanyGroupMgmDeletePopupComponent } from './company-group-mgm-delete-dialog.component';

export const companyGroupRoute: Routes = [
    {
        path: 'company-group-mgm',
        component: CompanyGroupMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyGroup.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'company-group-mgm/:id',
        component: CompanyGroupMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyGroup.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const companyGroupPopupRoute: Routes = [
    {
        path: 'company-group-mgm-new',
        component: CompanyGroupMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyGroup.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company-group-mgm/:id/edit',
        component: CompanyGroupMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyGroup.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company-group-mgm/:id/delete',
        component: CompanyGroupMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyGroup.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
