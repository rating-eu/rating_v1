import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ContainerMgmComponent } from './container-mgm.component';
import { ContainerMgmDetailComponent } from './container-mgm-detail.component';
import { ContainerMgmPopupComponent } from './container-mgm-dialog.component';
import { ContainerMgmDeletePopupComponent } from './container-mgm-delete-dialog.component';

export const containerRoute: Routes = [
    {
        path: 'container-mgm',
        component: ContainerMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.container.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'container-mgm/:id',
        component: ContainerMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.container.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const containerPopupRoute: Routes = [
    {
        path: 'container-mgm-new',
        component: ContainerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.container.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'container-mgm/:id/edit',
        component: ContainerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.container.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'container-mgm/:id/delete',
        component: ContainerMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.container.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
