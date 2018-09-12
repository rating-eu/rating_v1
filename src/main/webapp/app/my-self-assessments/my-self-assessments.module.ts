import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MySelfAssessmentsRoutingModule } from './my-self-assessments-routing.module';
import { MySelfAssessmentsComponent } from './my-self-assessments.component';

@NgModule({
  imports: [
    CommonModule,
    MySelfAssessmentsRoutingModule
  ],
  declarations: [MySelfAssessmentsComponent]
})
export class MySelfAssessmentsModule { }
