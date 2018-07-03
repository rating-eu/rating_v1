import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ResultsRoutingModule} from './results-routing.module';
import {ResultsOverviewComponent} from './results-overview/results-overview.component';
import {ResultsService} from "./results.service";

@NgModule({
    imports: [
        CommonModule,
        ResultsRoutingModule
    ],
    declarations: [ResultsOverviewComponent],
    providers: [ResultsService]
})
export class ResultsModule {
}
