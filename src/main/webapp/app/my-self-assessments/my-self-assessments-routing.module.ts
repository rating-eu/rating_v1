import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MySelfAssessmentsComponent} from './my-self-assessments.component';
import {UserRouteAccessService} from '../shared';

const routes: Routes = [
    {
        path: '',
        component: MySelfAssessmentsComponent,
        data: {
            pageTitle: 'hermeneutApp.selfAssessment.home.title',
            authorities: ['ROLE_CISO', 'ROLE_EXTERNAL_AUDIT'],
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MySelfAssessmentsRoutingModule {
}
