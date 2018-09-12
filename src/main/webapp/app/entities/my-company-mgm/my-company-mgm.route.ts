import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { MyCompanyMgmComponent } from './my-company-mgm.component';
import { MyCompanyMgmDetailComponent } from './my-company-mgm-detail.component';
import { MyCompanyMgmPopupComponent } from './my-company-mgm-dialog.component';
import { MyCompanyMgmDeletePopupComponent } from './my-company-mgm-delete-dialog.component';

export const myCompanyRoute: Routes = [
    {
        path: 'my-company-mgm',
        component: MyCompanyMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myCompany.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'my-company-mgm/:id',
        component: MyCompanyMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myCompany.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const myCompanyPopupRoute: Routes = [
    {
        path: 'my-company-mgm-new',
        component: MyCompanyMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myCompany.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-company-mgm/:id/edit',
        component: MyCompanyMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myCompany.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-company-mgm/:id/delete',
        component: MyCompanyMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myCompany.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
