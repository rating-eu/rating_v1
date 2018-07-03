import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ResultsOverviewComponent } from './results-overview/results-overview.component';

@NgModule({
  imports: [
    CommonModule,
    ResultsRoutingModule
  ],
  declarations: [ResultsOverviewComponent]
})
export class ResultsModule { }
