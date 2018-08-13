import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImpactEvaluationRoutingModule } from './impact-evaluation-routing.module';
import { ImpactEvaluationComponent } from './impact-evaluation/impact-evaluation.component';
import { ImpactEvaluationService } from './impact-evaluation.service';

@NgModule({
  imports: [
    CommonModule,
    ImpactEvaluationRoutingModule
  ],
  declarations: [
    ImpactEvaluationComponent
  ],
  exports: [
    ImpactEvaluationComponent
  ],
  providers: [
    ImpactEvaluationService
  ]
})
export class ImpactEvaluationModule { }
