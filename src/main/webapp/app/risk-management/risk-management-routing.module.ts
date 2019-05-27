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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RiskManagementComponent } from './risk-management/risk-management.component';
import { RiskEvaluationComponent } from './risk-evaluation/risk-evaluation.component';
import { RiskDetailsComponent } from './risk-details/risk-details.component';

const routes: Routes = [
    {
        path: '',
        component: RiskManagementComponent,
        data: {
            pageTitle: 'hermeneutApp.riskManagement.home.title'
        },
        children: [
            {
                path: 'risk-evaluation',
                component: RiskEvaluationComponent,
                data: {
                    pageTitle: 'hermeneutApp.riskManagement.riskEvaluation.title'
                }
            },
            {
                path: 'risk-details/:assetId',
                component: RiskDetailsComponent,
                data: {
                    pageTitle: 'hermeneutApp.riskManagement.riskDetails.title'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RiskManagementRoutingModule { }
