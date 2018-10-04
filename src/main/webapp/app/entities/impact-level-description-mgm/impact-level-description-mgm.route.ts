import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ImpactLevelDescriptionMgmComponent } from './impact-level-description-mgm.component';
import { ImpactLevelDescriptionMgmDetailComponent } from './impact-level-description-mgm-detail.component';
import { ImpactLevelDescriptionMgmPopupComponent } from './impact-level-description-mgm-dialog.component';
import { ImpactLevelDescriptionMgmDeletePopupComponent } from './impact-level-description-mgm-delete-dialog.component';

export const impactLevelDescriptionRoute: Routes = [
    {
        path: 'impact-level-description-mgm',
        component: ImpactLevelDescriptionMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevelDescription.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'impact-level-description-mgm/:id',
        component: ImpactLevelDescriptionMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevelDescription.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const impactLevelDescriptionPopupRoute: Routes = [
    {
        path: 'impact-level-description-mgm-new',
        component: ImpactLevelDescriptionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevelDescription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'impact-level-description-mgm/:id/edit',
        component: ImpactLevelDescriptionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevelDescription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'impact-level-description-mgm/:id/delete',
        component: ImpactLevelDescriptionMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevelDescription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
