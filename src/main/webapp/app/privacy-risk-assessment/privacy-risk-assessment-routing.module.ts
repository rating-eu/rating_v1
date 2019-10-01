import {Input, NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DataOperationsComponent} from './data-operations/data-operations.component';
import {GDPRQuestionnaireMgm} from "../entities/gdpr-questionnaire-mgm";
import {DataOperationContextComponent} from "./data-operation-context/data-operation-context.component";

const routes: Routes = [
    {
        path: 'operations',
        component: DataOperationsComponent
    },
    {
        path: 'context',
        component: DataOperationContextComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivacyRiskAssessmentRoutingModule {
}
