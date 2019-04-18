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

import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MyRiskAssessmentsComponent} from './my-risk-assessments.component';
import {UserRouteAccessService} from '../shared';

const routes: Routes = [
    {
        path: '',
        component: MyRiskAssessmentsComponent,
        data: {
            pageTitle: 'hermeneutApp.selfAssessment.home.title',
            authorities: ['ROLE_CISO', 'ROLE_EXTERNAL_AUDIT'],
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyRiskAssessmentsRoutingModule {
}
