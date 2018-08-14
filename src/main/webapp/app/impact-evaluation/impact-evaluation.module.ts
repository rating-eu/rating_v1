import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImpactEvaluationRoutingModule } from './impact-evaluation-routing.module';
import { ImpactEvaluationComponent } from './impact-evaluation/impact-evaluation.component';
import { ImpactEvaluationService } from './impact-evaluation.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ImpactEvaluationRoutingModule,
    ReactiveFormsModule
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
