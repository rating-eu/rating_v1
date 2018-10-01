import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MySelfAssessmentsRoutingModule } from './my-self-assessments-routing.module';
import { MySelfAssessmentsComponent } from './my-self-assessments.component';
import { FormsModule } from '../../../../../node_modules/@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MySelfAssessmentsRoutingModule,
    FormsModule
  ],
  declarations: [MySelfAssessmentsComponent]
})
export class MySelfAssessmentsModule { }
