import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { DataImpactDescriptionMgmComponent } from './data-impact-description-mgm.component';
import { DataImpactDescriptionMgmDetailComponent } from './data-impact-description-mgm-detail.component';
import { DataImpactDescriptionMgmPopupComponent } from './data-impact-description-mgm-dialog.component';
import { DataImpactDescriptionMgmDeletePopupComponent } from './data-impact-description-mgm-delete-dialog.component';

export const dataImpactDescriptionRoute: Routes = [
    {
        path: 'data-impact-description-mgm',
        component: DataImpactDescriptionMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataImpactDescription.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'data-impact-description-mgm/:id',
        component: DataImpactDescriptionMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataImpactDescription.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const dataImpactDescriptionPopupRoute: Routes = [
    {
        path: 'data-impact-description-mgm-new',
        component: DataImpactDescriptionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataImpactDescription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'data-impact-description-mgm/:id/edit',
        component: DataImpactDescriptionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataImpactDescription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'data-impact-description-mgm/:id/delete',
        component: DataImpactDescriptionMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.dataImpactDescription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
