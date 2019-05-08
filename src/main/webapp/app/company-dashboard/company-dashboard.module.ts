import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyDashboardRoutingModule } from './company-dashboard-routing.module';
import { EntryPointComponent } from './entry-point/entry-point.component';
import { VulnerabilityRadarWidgetComponent } from './vulnerability-radar-widget/vulnerability-radar-widget.component';

@NgModule({
  imports: [
    CommonModule,
    CompanyDashboardRoutingModule
  ],
  declarations: [EntryPointComponent, VulnerabilityRadarWidgetComponent]
})
export class CompanyDashboardModule { }
