import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { EconomicCoefficientsMgmComponent } from './economic-coefficients-mgm.component';
import { EconomicCoefficientsMgmDetailComponent } from './economic-coefficients-mgm-detail.component';
import { EconomicCoefficientsMgmPopupComponent } from './economic-coefficients-mgm-dialog.component';
import { EconomicCoefficientsMgmDeletePopupComponent } from './economic-coefficients-mgm-delete-dialog.component';

export const economicCoefficientsRoute: Routes = [
    {
        path: 'economic-coefficients-mgm',
        component: EconomicCoefficientsMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.economicCoefficients.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'economic-coefficients-mgm/:id',
        component: EconomicCoefficientsMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.economicCoefficients.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const economicCoefficientsPopupRoute: Routes = [
    {
        path: 'economic-coefficients-mgm-new',
        component: EconomicCoefficientsMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.economicCoefficients.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'economic-coefficients-mgm/:id/edit',
        component: EconomicCoefficientsMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.economicCoefficients.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'economic-coefficients-mgm/:id/delete',
        component: EconomicCoefficientsMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.economicCoefficients.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
