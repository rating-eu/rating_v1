import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DemoRoutingModule} from './demo-routing.module';
import {DemoComponent} from './demo/demo.component';
import {DemoService} from './demo.service';
import {DashboardModule} from '../dashboard/dashboard.module';
import {PrivacyRiskAssessmentModule} from '../privacy-risk-assessment/privacy-risk-assessment.module';

@NgModule({
    imports: [
        CommonModule,
        DemoRoutingModule,
        DashboardModule,
        PrivacyRiskAssessmentModule
    ],
    declarations: [DemoComponent],
    providers: [
        DemoService
    ]
})
export class DemoModule {
}
