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
import { QuestionnaireStatusMgmComponent } from './questionnaire-status-mgm.component';
import { QuestionnaireStatusMgmDetailComponent } from './questionnaire-status-mgm-detail.component';
import { QuestionnaireStatusMgmPopupComponent } from './questionnaire-status-mgm-dialog.component';
import { QuestionnaireStatusMgmDeletePopupComponent } from './questionnaire-status-mgm-delete-dialog.component';

export const questionnaireStatusRoute: Routes = [
    {
        path: 'questionnaire-status-mgm',
        component: QuestionnaireStatusMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'questionnaire-status-mgm/:id',
        component: QuestionnaireStatusMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const questionnaireStatusPopupRoute: Routes = [
    {
        path: 'questionnaire-status-mgm-new',
        component: QuestionnaireStatusMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'questionnaire-status-mgm/:id/edit',
        component: QuestionnaireStatusMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'questionnaire-status-mgm/:id/delete',
        component: QuestionnaireStatusMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaireStatus.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
