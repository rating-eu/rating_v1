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
import { MyAnswerMgmComponent } from './my-answer-mgm.component';
import { MyAnswerMgmDetailComponent } from './my-answer-mgm-detail.component';
import { MyAnswerMgmPopupComponent } from './my-answer-mgm-dialog.component';
import { MyAnswerMgmDeletePopupComponent } from './my-answer-mgm-delete-dialog.component';

export const myAnswerRoute: Routes = [
    {
        path: 'my-answer-mgm',
        component: MyAnswerMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAnswer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'my-answer-mgm/:id',
        component: MyAnswerMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAnswer.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const myAnswerPopupRoute: Routes = [
    {
        path: 'my-answer-mgm-new',
        component: MyAnswerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-answer-mgm/:id/edit',
        component: MyAnswerMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'my-answer-mgm/:id/delete',
        component: MyAnswerMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.myAnswer.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
