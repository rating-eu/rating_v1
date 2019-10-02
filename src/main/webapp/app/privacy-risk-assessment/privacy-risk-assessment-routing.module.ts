import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DataOperationsComponent} from './data-operations/data-operations.component';
import {DataOperationContextComponent} from "./data-operation-context/data-operation-context.component";
import {SecurityImpactComponent} from "./security-impact/security-impact.component";

const routes: Routes = [
    {
        path: 'operations',
        component: DataOperationsComponent
    },
    {
        path: 'context',
        component: DataOperationContextComponent
    },
    {
        path: 'impact',
        component: SecurityImpactComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivacyRiskAssessmentRoutingModule {
}
