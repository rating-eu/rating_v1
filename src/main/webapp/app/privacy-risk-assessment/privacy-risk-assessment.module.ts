import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyRiskAssessmentRoutingModule } from './privacy-risk-assessment-routing.module';
import { ProcessesComponent } from './processes/processes.component';

@NgModule({
  imports: [
    CommonModule,
    PrivacyRiskAssessmentRoutingModule
  ],
  declarations: [ProcessesComponent]
})
export class PrivacyRiskAssessmentModule { }
