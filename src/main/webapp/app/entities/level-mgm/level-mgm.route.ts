import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LevelMgmComponent } from './level-mgm.component';
import { LevelMgmDetailComponent } from './level-mgm-detail.component';
import { LevelMgmPopupComponent } from './level-mgm-dialog.component';
import { LevelMgmDeletePopupComponent } from './level-mgm-delete-dialog.component';

export const levelRoute: Routes = [
    {
        path: 'level-mgm',
        component: LevelMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.level.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'level-mgm/:id',
        component: LevelMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.level.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const levelPopupRoute: Routes = [
    {
        path: 'level-mgm-new',
        component: LevelMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.level.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'level-mgm/:id/edit',
        component: LevelMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.level.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'level-mgm/:id/delete',
        component: LevelMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.level.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
