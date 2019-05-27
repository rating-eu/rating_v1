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
import { QuestionnaireMgmComponent } from './questionnaire-mgm.component';
import { QuestionnaireMgmDetailComponent } from './questionnaire-mgm-detail.component';
import { QuestionnaireMgmPopupComponent } from './questionnaire-mgm-dialog.component';
import { QuestionnaireMgmDeletePopupComponent } from './questionnaire-mgm-delete-dialog.component';

export const questionnaireRoute: Routes = [
    {
        path: 'questionnaire-mgm',
        component: QuestionnaireMgmComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaire.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'questionnaire-mgm/:id',
        component: QuestionnaireMgmDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaire.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const questionnairePopupRoute: Routes = [
    {
        path: 'questionnaire-mgm-new',
        component: QuestionnaireMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaire.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'questionnaire-mgm/:id/edit',
        component: QuestionnaireMgmPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaire.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'questionnaire-mgm/:id/delete',
        component: QuestionnaireMgmDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'hermeneutApp.questionnaire.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
