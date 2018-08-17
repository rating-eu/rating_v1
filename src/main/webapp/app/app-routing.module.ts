import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {errorRoute, navbarRoute} from './layouts';
import {DEBUG_INFO_ENABLED} from './app.constants';

const routes: Routes = [
    navbarRoute,
    ...errorRoute,
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
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {useHash: true, enableTracing: DEBUG_INFO_ENABLED})
    ],
    exports: [
        RouterModule
    ]
})
export class HermeneutAppRoutingModule {
}
