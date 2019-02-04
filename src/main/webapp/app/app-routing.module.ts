import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { errorRoute, navbarRoute, sidebarRoute } from './layouts';
import { UserRouteAccessService } from './shared';

const routes: Routes = [
    navbarRoute,
    sidebarRoute,
    ...errorRoute,
    {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        data: {
            authorities: ['ROLE_CISO'],
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'risk-management',
        loadChildren: './risk-management/risk-management.module#RiskManagementModule',
        data: {
            authorities: ['ROLE_CISO'],
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'impact-evaluation',
        loadChildren: './impact-evaluation/impact-evaluation.module#ImpactEvaluationModule',
        data: {
            authorities: ['ROLE_CISO'],
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'identify-asset',
        loadChildren: './identify-assets/identify-asset.module#IdentifyAssetModule',
        data: {
            authorities: ['ROLE_CISO'],
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'identify-threat-agent',
        loadChildren: './identify-threat-agent/identify-threat-agent.module#IdentifyThreatAgentModule',
        data: {
            authorities: ['ROLE_CISO'],
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'evaluate-weakness',
        loadChildren: './evaluate-weakness/evaluate-weakness.module#EvaluateWeaknessModule',
        data: {
            authorities: ['ROLE_CISO', 'ROLE_EXTERNAL'],
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'external-audit',
        loadChildren: './external-audit/external-audit.module#ExternalAuditModule',
        data: {
            authorities: ['ROLE_EXTERNAL'],
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'results',
        loadChildren: './results/results.module#ResultsModule',
        data: {
            authorities: ['ROLE_CISO'],
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-company',
        loadChildren: './my-company/my-company.module#MyCompanyModule',
        data: {
            authorities: ['ROLE_CISO'],
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'my-self-assessments',
        loadChildren: './my-self-assessments/my-self-assessments.module#MySelfAssessmentsModule',
        data: {
            authorities: ['ROLE_CISO', 'ROLE_EXTERNAL'],
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'pages',
        loadChildren: './service-pages/service-pages.module#ServicePagesModule',
        data: {
            authorities: ['ROLE_USER'],
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class HermeneutAppRoutingModule {
}
