import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProcessesComponent} from "./processes/processes.component";

const routes: Routes = [
    {
        path: 'processes',
        component: ProcessesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivacyRiskAssessmentRoutingModule {
}
