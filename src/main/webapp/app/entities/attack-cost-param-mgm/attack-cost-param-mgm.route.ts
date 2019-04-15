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
import { AttackCostParamMgmComponent } from './attack-cost-param-mgm.component';
import { AttackCostParamMgmDetailComponent } from './attack-cost-param-mgm-detail.component';
import { AttackCostParamMgmPopupComponent } from './attack-cost-param-mgm-dialog.component';
import { AttackCostParamMgmDeletePopupComponent } from './attack-cost-param-mgm-delete-dialog.component';

export const attackCostParamRoute: Routes = [
    {
        path: 'attack-cost-param-mgm',
        component: AttackCostParamMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCostParam.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'attack-cost-param-mgm/:id',
        component: AttackCostParamMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCostParam.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const attackCostParamPopupRoute: Routes = [
    {
        path: 'attack-cost-param-mgm-new',
        component: AttackCostParamMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCostParam.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-cost-param-mgm/:id/edit',
        component: AttackCostParamMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCostParam.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-cost-param-mgm/:id/delete',
        component: AttackCostParamMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackCostParam.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
