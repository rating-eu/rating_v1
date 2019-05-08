import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyDashboardRoutingModule } from './company-dashboard-routing.module';
import { EntryPointComponent } from './entry-point/entry-point.component';

@NgModule({
  imports: [
    CommonModule,
    CompanyDashboardRoutingModule
  ],
  declarations: [EntryPointComponent]
})
export class CompanyDashboardModule { }
