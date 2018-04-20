import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { DepartmentMgmComponent } from './department-mgm.component';
import { DepartmentMgmDetailComponent } from './department-mgm-detail.component';
import { DepartmentMgmPopupComponent } from './department-mgm-dialog.component';
import { DepartmentMgmDeletePopupComponent } from './department-mgm-delete-dialog.component';

export const departmentRoute: Routes = [
    {
        path: 'department-mgm',
        component: DepartmentMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.department.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'department-mgm/:id',
        component: DepartmentMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.department.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const departmentPopupRoute: Routes = [
    {
        path: 'department-mgm-new',
        component: DepartmentMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.department.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'department-mgm/:id/edit',
        component: DepartmentMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.department.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'department-mgm/:id/delete',
        component: DepartmentMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.department.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
