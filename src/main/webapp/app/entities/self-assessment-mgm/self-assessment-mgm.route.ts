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
import { SelfAssessmentMgmComponent } from './self-assessment-mgm.component';
import { SelfAssessmentMgmDetailComponent } from './self-assessment-mgm-detail.component';
import { SelfAssessmentMgmPopupComponent } from './self-assessment-mgm-dialog.component';
import { SelfAssessmentMgmDeletePopupComponent } from './self-assessment-mgm-delete-dialog.component';

export const selfAssessmentRoute: Routes = [
    {
        path: 'self-assessment-mgm',
        component: SelfAssessmentMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.selfAssessment.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'self-assessment-mgm/:id',
        component: SelfAssessmentMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.selfAssessment.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const selfAssessmentPopupRoute: Routes = [
    {
        path: 'self-assessment-mgm-new',
        component: SelfAssessmentMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.selfAssessment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'self-assessment-mgm/:id/edit',
        component: SelfAssessmentMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.selfAssessment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'self-assessment-mgm/:id/delete',
        component: SelfAssessmentMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.selfAssessment.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
