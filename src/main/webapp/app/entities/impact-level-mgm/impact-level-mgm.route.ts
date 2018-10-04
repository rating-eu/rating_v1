import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ImpactLevelMgmComponent } from './impact-level-mgm.component';
import { ImpactLevelMgmDetailComponent } from './impact-level-mgm-detail.component';
import { ImpactLevelMgmPopupComponent } from './impact-level-mgm-dialog.component';
import { ImpactLevelMgmDeletePopupComponent } from './impact-level-mgm-delete-dialog.component';

export const impactLevelRoute: Routes = [
    {
        path: 'impact-level-mgm',
        component: ImpactLevelMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevel.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'impact-level-mgm/:id',
        component: ImpactLevelMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevel.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const impactLevelPopupRoute: Routes = [
    {
        path: 'impact-level-mgm-new',
        component: ImpactLevelMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevel.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'impact-level-mgm/:id/edit',
        component: ImpactLevelMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevel.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'impact-level-mgm/:id/delete',
        component: ImpactLevelMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevel.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
