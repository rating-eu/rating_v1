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
import { AnswerWeightMgmComponent } from './answer-weight-mgm.component';
import { AnswerWeightMgmDetailComponent } from './answer-weight-mgm-detail.component';
import { AnswerWeightMgmPopupComponent } from './answer-weight-mgm-dialog.component';
import { AnswerWeightMgmDeletePopupComponent } from './answer-weight-mgm-delete-dialog.component';

export const answerWeightRoute: Routes = [
    {
        path: 'answer-weight-mgm',
        component: AnswerWeightMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answerWeight.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'answer-weight-mgm/:id',
        component: AnswerWeightMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answerWeight.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const answerWeightPopupRoute: Routes = [
    {
        path: 'answer-weight-mgm-new',
        component: AnswerWeightMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answerWeight.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'answer-weight-mgm/:id/edit',
        component: AnswerWeightMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answerWeight.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'answer-weight-mgm/:id/delete',
        component: AnswerWeightMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.answerWeight.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
