import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ResultsOverviewComponent} from './results-overview/results-overview.component';

const routes: Routes = [
    {
        path: '',
        component: ResultsOverviewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResultsRoutingModule {
}
