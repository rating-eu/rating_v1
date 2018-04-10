import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { MotivationMgmComponent } from './motivation-mgm.component';
import { MotivationMgmDetailComponent } from './motivation-mgm-detail.component';
import { MotivationMgmPopupComponent } from './motivation-mgm-dialog.component';
import { MotivationMgmDeletePopupComponent } from './motivation-mgm-delete-dialog.component';

export const motivationRoute: Routes = [
    {
        path: 'motivation-mgm',
        component: MotivationMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.motivation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'motivation-mgm/:id',
        component: MotivationMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.motivation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const motivationPopupRoute: Routes = [
    {
        path: 'motivation-mgm-new',
        component: MotivationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.motivation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'motivation-mgm/:id/edit',
        component: MotivationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.motivation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'motivation-mgm/:id/delete',
        component: MotivationMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.motivation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
