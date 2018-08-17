import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskManagementRoutingModule } from './risk-management-routing.module';
import { RiskManagementComponent } from './risk-management/risk-management.component';
import { RiskManagementService } from './risk-management.service';
import { RiskEvaluationComponent } from './risk-evaluation/risk-evaluation.component';
import { RiskMitigationComponent } from './risk-mitigation/risk-mitigation.component';

@NgModule({
  imports: [
    CommonModule,
    RiskManagementRoutingModule
  ],
  declarations: [RiskManagementComponent, RiskEvaluationComponent, RiskMitigationComponent],
  providers: [
    RiskManagementService
  ]
})
export class RiskManagementModule { }
