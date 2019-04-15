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
import { LevelMgmComponent } from './level-mgm.component';
import { LevelMgmDetailComponent } from './level-mgm-detail.component';
import { LevelMgmPopupComponent } from './level-mgm-dialog.component';
import { LevelMgmDeletePopupComponent } from './level-mgm-delete-dialog.component';

export const levelRoute: Routes = [
    {
        path: 'level-mgm',
        component: LevelMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.level.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'level-mgm/:id',
        component: LevelMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.level.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const levelPopupRoute: Routes = [
    {
        path: 'level-mgm-new',
        component: LevelMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.level.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'level-mgm/:id/edit',
        component: LevelMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.level.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'level-mgm/:id/delete',
        component: LevelMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.level.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
