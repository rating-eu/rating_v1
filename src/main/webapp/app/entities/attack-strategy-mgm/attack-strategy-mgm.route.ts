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
import { AttackStrategyMgmComponent } from './attack-strategy-mgm.component';
import { AttackStrategyMgmDetailComponent } from './attack-strategy-mgm-detail.component';
import { AttackStrategyMgmPopupComponent } from './attack-strategy-mgm-dialog.component';
import { AttackStrategyMgmDeletePopupComponent } from './attack-strategy-mgm-delete-dialog.component';

export const attackStrategyRoute: Routes = [
    {
        path: 'attack-strategy-mgm',
        component: AttackStrategyMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackStrategy.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'attack-strategy-mgm/:id',
        component: AttackStrategyMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackStrategy.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const attackStrategyPopupRoute: Routes = [
    {
        path: 'attack-strategy-mgm-new',
        component: AttackStrategyMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackStrategy.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-strategy-mgm/:id/edit',
        component: AttackStrategyMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackStrategy.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'attack-strategy-mgm/:id/delete',
        component: AttackStrategyMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.attackStrategy.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
