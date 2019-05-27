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
