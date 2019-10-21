import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DataOperationsComponent} from './data-operations/data-operations.component';
import {DataOperationContextComponent} from './data-operation-context/data-operation-context.component';
import {SecurityImpactComponent} from './security-impact/security-impact.component';
import {DataThreatComponent} from './data-threat/data-threat.component';
import {DataRiskComponent} from "./data-risk/data-risk.component";

const routes: Routes = [
    {
        path: 'operations',
        component: DataOperationsComponent,
        data: {
            pageTitle: 'gdpr.data-operations.page.title'
        }
    },
    {
        path: 'context',
        component: DataOperationContextComponent,
        data: {
            pageTitle: 'gdpr.operation-context.page.title'
        }
    },
    {
        path: 'impact',
        component: SecurityImpactComponent,
        data: {
            pageTitle: 'gdpr.operation-impacts.page.title'
        }
    },
    {
        path: 'threat',
        component: DataThreatComponent,
        data: {
            pageTitle: 'gdpr.operation-threats.page.title'
        }
    },
    {
        path: 'risk',
        component: DataRiskComponent,
        data: {
            pageTitle: 'gdpr.operation-risks.page.title'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivacyRiskAssessmentRoutingModule {
}
