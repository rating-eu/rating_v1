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
import { AttackCostMgmComponent } from './attack-cost-mgm.component';
import { AttackCostMgmDetailComponent } from './attack-cost-mgm-detail.component';
import { AttackCostMgmPopupComponent } from './attack-cost-mgm-dialog.component';
import { AttackCostMgmDeletePopupComponent } from './attack-cost-mgm-delete-dialog.component';

export const attackCostRoute: Routes = [
    {
        path: 'attack-cost-mgm',
        component: AttackCostMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCost.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'attack-cost-mgm/:id',
        component: AttackCostMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCost.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const attackCostPopupRoute: Routes = [
    {
        path: 'attack-cost-mgm-new',
        component: AttackCostMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCost.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-cost-mgm/:id/edit',
        component: AttackCostMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCost.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-cost-mgm/:id/delete',
        component: AttackCostMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCost.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
