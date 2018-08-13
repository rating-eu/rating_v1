import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { EconomicResultsMgmComponent } from './economic-results-mgm.component';
import { EconomicResultsMgmDetailComponent } from './economic-results-mgm-detail.component';
import { EconomicResultsMgmPopupComponent } from './economic-results-mgm-dialog.component';
import { EconomicResultsMgmDeletePopupComponent } from './economic-results-mgm-delete-dialog.component';

export const economicResultsRoute: Routes = [
    {
        path: 'economic-results-mgm',
        component: EconomicResultsMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.economicResults.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'economic-results-mgm/:id',
        component: EconomicResultsMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.economicResults.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const economicResultsPopupRoute: Routes = [
    {
        path: 'economic-results-mgm-new',
        component: EconomicResultsMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.economicResults.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'economic-results-mgm/:id/edit',
        component: EconomicResultsMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.economicResults.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'economic-results-mgm/:id/delete',
        component: EconomicResultsMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.economicResults.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
