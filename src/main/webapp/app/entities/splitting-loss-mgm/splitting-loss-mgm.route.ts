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
import { SplittingLossMgmComponent } from './splitting-loss-mgm.component';
import { SplittingLossMgmDetailComponent } from './splitting-loss-mgm-detail.component';
import { SplittingLossMgmPopupComponent } from './splitting-loss-mgm-dialog.component';
import { SplittingLossMgmDeletePopupComponent } from './splitting-loss-mgm-delete-dialog.component';

export const splittingLossRoute: Routes = [
    {
        path: 'splitting-loss-mgm',
        component: SplittingLossMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingLoss.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'splitting-loss-mgm/:id',
        component: SplittingLossMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingLoss.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const splittingLossPopupRoute: Routes = [
    {
        path: 'splitting-loss-mgm-new',
        component: SplittingLossMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingLoss.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'splitting-loss-mgm/:id/edit',
        component: SplittingLossMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingLoss.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'splitting-loss-mgm/:id/delete',
        component: SplittingLossMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.splittingLoss.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
