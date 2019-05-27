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
import { ImpactLevelDescriptionMgmComponent } from './impact-level-description-mgm.component';
import { ImpactLevelDescriptionMgmDetailComponent } from './impact-level-description-mgm-detail.component';
import { ImpactLevelDescriptionMgmPopupComponent } from './impact-level-description-mgm-dialog.component';
import { ImpactLevelDescriptionMgmDeletePopupComponent } from './impact-level-description-mgm-delete-dialog.component';

export const impactLevelDescriptionRoute: Routes = [
    {
        path: 'impact-level-description-mgm',
        component: ImpactLevelDescriptionMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevelDescription.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'impact-level-description-mgm/:id',
        component: ImpactLevelDescriptionMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevelDescription.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const impactLevelDescriptionPopupRoute: Routes = [
    {
        path: 'impact-level-description-mgm-new',
        component: ImpactLevelDescriptionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevelDescription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'impact-level-description-mgm/:id/edit',
        component: ImpactLevelDescriptionMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevelDescription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'impact-level-description-mgm/:id/delete',
        component: ImpactLevelDescriptionMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.impactLevelDescription.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
