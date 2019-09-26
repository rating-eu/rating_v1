import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyRiskAssessmentRoutingModule } from './privacy-risk-assessment-routing.module';
import { DataOperationsComponent } from './data-operations/data-operations.component';

@NgModule({
  imports: [
    CommonModule,
    PrivacyRiskAssessmentRoutingModule
  ],
  declarations: [DataOperationsComponent]
})
export class PrivacyRiskAssessmentModule { }
