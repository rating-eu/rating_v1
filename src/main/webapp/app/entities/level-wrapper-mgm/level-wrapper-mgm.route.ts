import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LevelWrapperMgmComponent } from './level-wrapper-mgm.component';
import { LevelWrapperMgmDetailComponent } from './level-wrapper-mgm-detail.component';
import { LevelWrapperMgmPopupComponent } from './level-wrapper-mgm-dialog.component';
import { LevelWrapperMgmDeletePopupComponent } from './level-wrapper-mgm-delete-dialog.component';

export const levelWrapperRoute: Routes = [
    {
        path: 'level-wrapper-mgm',
        component: LevelWrapperMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.levelWrapper.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'level-wrapper-mgm/:id',
        component: LevelWrapperMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.levelWrapper.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const levelWrapperPopupRoute: Routes = [
    {
        path: 'level-wrapper-mgm-new',
        component: LevelWrapperMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.levelWrapper.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'level-wrapper-mgm/:id/edit',
        component: LevelWrapperMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.levelWrapper.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'level-wrapper-mgm/:id/delete',
        component: LevelWrapperMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.levelWrapper.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
