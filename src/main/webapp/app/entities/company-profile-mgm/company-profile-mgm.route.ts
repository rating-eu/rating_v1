import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { CompanyProfileMgmComponent } from './company-profile-mgm.component';
import { CompanyProfileMgmDetailComponent } from './company-profile-mgm-detail.component';
import { CompanyProfileMgmPopupComponent } from './company-profile-mgm-dialog.component';
import { CompanyProfileMgmDeletePopupComponent } from './company-profile-mgm-delete-dialog.component';

export const companyProfileRoute: Routes = [
    {
        path: 'company-profile-mgm',
        component: CompanyProfileMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyProfile.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'company-profile-mgm/:id',
        component: CompanyProfileMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyProfile.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const companyProfilePopupRoute: Routes = [
    {
        path: 'company-profile-mgm-new',
        component: CompanyProfileMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyProfile.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company-profile-mgm/:id/edit',
        component: CompanyProfileMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyProfile.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'company-profile-mgm/:id/delete',
        component: CompanyProfileMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.companyProfile.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
