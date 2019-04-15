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
import { MotivationMgmComponent } from './motivation-mgm.component';
import { MotivationMgmDetailComponent } from './motivation-mgm-detail.component';
import { MotivationMgmPopupComponent } from './motivation-mgm-dialog.component';
import { MotivationMgmDeletePopupComponent } from './motivation-mgm-delete-dialog.component';

export const motivationRoute: Routes = [
    {
        path: 'motivation-mgm',
        component: MotivationMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.motivation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'motivation-mgm/:id',
        component: MotivationMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.motivation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const motivationPopupRoute: Routes = [
    {
        path: 'motivation-mgm-new',
        component: MotivationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.motivation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'motivation-mgm/:id/edit',
        component: MotivationMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.motivation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'motivation-mgm/:id/delete',
        component: MotivationMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.motivation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
