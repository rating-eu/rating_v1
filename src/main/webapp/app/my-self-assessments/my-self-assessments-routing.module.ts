import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MySelfAssessmentsComponent} from './my-self-assessments.component';

const routes: Routes = [
    {
        path: '',
        component: MySelfAssessmentsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MySelfAssessmentsRoutingModule {
}
