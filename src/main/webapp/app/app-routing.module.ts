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
import {RouterModule, Routes} from '@angular/router';
import {errorRoute, navbarRoute, sidebarRoute} from './layouts';
import {UserRouteAccessService} from './shared';

const routes: Routes = [
    navbarRoute,
    sidebarRoute,
    ...errorRoute,
    {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        data: {
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'riskboard',
        loadChildren: './risk-board/risk-board.module#RiskBoardModule',
        data: {
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'risk-management',
        loadChildren: './risk-management/risk-management.module#RiskManagementModule',
        data: {
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'impact-evaluation',
        loadChildren: './impact-evaluation/impact-evaluation.module#ImpactEvaluationModule',
        data: {
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'identify-asset',
        loadChildren: './identify-assets/identify-asset.module#IdentifyAssetModule',
        data: {
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'identify-threat-agent',
        loadChildren: './identify-threat-agent/identify-threat-agent.module#IdentifyThreatAgentModule',
        data: {
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'evaluate-weakness',
        loadChildren: './evaluate-weakness/evaluate-weakness.module#EvaluateWeaknessModule',
        data: {
            authorities: ['ROLE_CISO', 'ROLE_EXTERNAL_AUDIT']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'results',
        loadChildren: './results/results.module#ResultsModule',
        data: {
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-company',
        loadChildren: './my-company/my-company.module#MyCompanyModule',
        data: {
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-risk-assessments',
        loadChildren: './my-risk-assessments/my-risk-assessments.module#MyRiskAssessmentsModule',
        data: {
            authorities: ['ROLE_CISO', 'ROLE_EXTERNAL_AUDIT']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'privacy-risk-assessment',
        loadChildren: './privacy-risk-assessment/privacy-risk-assessment.module#PrivacyRiskAssessmentModule'
    },
    {
        path: 'privacy-board',
        loadChildren: './privacy-board/privacy-board.module#PrivacyBoardModule'
    },
    {
        path: 'pages',
        loadChildren: './service-pages/service-pages.module#ServicePagesModule',
        data: {
            authorities: ['ROLE_USER']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'people',
        loadChildren: './employees/employees.module#EmployeesModule',
        data: {
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {useHash: true})
    ],
    exports: [
        RouterModule
    ]
})
export class HermeneutAppRoutingModule {
}
