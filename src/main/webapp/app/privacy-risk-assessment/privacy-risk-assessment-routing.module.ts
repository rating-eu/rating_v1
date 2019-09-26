import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DataOperationsComponent} from './data-operations/data-operations.component';

const routes: Routes = [
    {
        path: 'operations',
        component: DataOperationsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivacyRiskAssessmentRoutingModule {
}
