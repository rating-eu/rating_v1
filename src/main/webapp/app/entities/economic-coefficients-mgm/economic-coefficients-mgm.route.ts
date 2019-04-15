/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
