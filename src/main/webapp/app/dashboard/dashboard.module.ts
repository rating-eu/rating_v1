import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartsModule} from 'ng2-charts';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {EntryPointComponent} from './entry-point/entry-point.component';
import {VulnerabilityRadarWidgetComponent} from './vulnerability-radar-widget/vulnerability-radar-widget.component';
import {NgbCollapseModule} from "@ng-bootstrap/ng-bootstrap";
import { StepStatusWidgetComponent } from './step-status-widget/step-status-widget.component';
import {DashboardService} from "./dashboard.service";

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        ChartsModule,
        NgbCollapseModule.forRoot()
    ],
    declarations: [EntryPointComponent, VulnerabilityRadarWidgetComponent, StepStatusWidgetComponent],
    providers:[
        DashboardService
    ]
})
export class DashboardModule {
}
