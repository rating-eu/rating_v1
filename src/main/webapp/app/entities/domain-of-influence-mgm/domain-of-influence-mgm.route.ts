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
import { DomainOfInfluenceMgmComponent } from './domain-of-influence-mgm.component';
import { DomainOfInfluenceMgmDetailComponent } from './domain-of-influence-mgm-detail.component';
import { DomainOfInfluenceMgmPopupComponent } from './domain-of-influence-mgm-dialog.component';
import { DomainOfInfluenceMgmDeletePopupComponent } from './domain-of-influence-mgm-delete-dialog.component';

export const domainOfInfluenceRoute: Routes = [
    {
        path: 'domain-of-influence-mgm',
        component: DomainOfInfluenceMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.domainOfInfluence.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'domain-of-influence-mgm/:id',
        component: DomainOfInfluenceMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.domainOfInfluence.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const domainOfInfluencePopupRoute: Routes = [
    {
        path: 'domain-of-influence-mgm-new',
        component: DomainOfInfluenceMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.domainOfInfluence.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'domain-of-influence-mgm/:id/edit',
        component: DomainOfInfluenceMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.domainOfInfluence.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'domain-of-influence-mgm/:id/delete',
        component: DomainOfInfluenceMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.domainOfInfluence.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
