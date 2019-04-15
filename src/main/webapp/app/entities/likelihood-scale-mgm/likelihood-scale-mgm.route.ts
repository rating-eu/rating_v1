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
import { LikelihoodScaleMgmComponent } from './likelihood-scale-mgm.component';
import { LikelihoodScaleMgmDetailComponent } from './likelihood-scale-mgm-detail.component';
import { LikelihoodScaleMgmPopupComponent } from './likelihood-scale-mgm-dialog.component';
import { LikelihoodScaleMgmDeletePopupComponent } from './likelihood-scale-mgm-delete-dialog.component';

export const likelihoodScaleRoute: Routes = [
    {
        path: 'likelihood-scale-mgm',
        component: LikelihoodScaleMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodScale.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'likelihood-scale-mgm/:id',
        component: LikelihoodScaleMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodScale.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const likelihoodScalePopupRoute: Routes = [
    {
        path: 'likelihood-scale-mgm-new',
        component: LikelihoodScaleMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodScale.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'likelihood-scale-mgm/:id/edit',
        component: LikelihoodScaleMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodScale.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'likelihood-scale-mgm/:id/delete',
        component: LikelihoodScaleMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.likelihoodScale.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
