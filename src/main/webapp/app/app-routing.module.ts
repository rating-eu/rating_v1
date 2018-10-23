import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {errorRoute, navbarRoute, sidebarRoute} from './layouts';

const routes: Routes = [
    navbarRoute,
    sidebarRoute,
    ...errorRoute,

    {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'risk-management',
        loadChildren: './risk-management/risk-management.module#RiskManagementModule'
    },
    {
        path: 'impact-evaluation',
        loadChildren: './impact-evaluation/impact-evaluation.module#ImpactEvaluationModule'
    },
    {
        path: 'identify-asset',
        loadChildren: './identify-assets/identify-asset.module#IdentifyAssetModule'
    },
    {
        path: 'identify-threat-agent',
        loadChildren: './identify-threat-agent/identify-threat-agent.module#IdentifyThreatAgentModule'
    },
    {
        path: 'evaluate-weakness',
        loadChildren: './evaluate-weakness/evaluate-weakness.module#EvaluateWeaknessModule'
    },
    {
        path: 'external-audit',
        loadChildren: './external-audit/external-audit.module#ExternalAuditModule'
    },
    {
        path: 'results',
        loadChildren: './results/results.module#ResultsModule'
    },
    {
        path: 'my-company',
        loadChildren: './my-company/my-company.module#MyCompanyModule'
    },
    {
        path: 'my-self-assessments',
        loadChildren: './my-self-assessments/my-self-assessments.module#MySelfAssessmentsModule'
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
