import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardOneComponent} from './dashboard-one/dashboard-one.component';
import { UserRouteAccessService } from '../shared';

const routes: Routes = [
    {
        path: '',
        component: DashboardOneComponent,
        data: {
            pageTitle: 'hermeneutApp.dashboardSection.page.dashboard.title',
            authorities: ['ROLE_CISO'],
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardRoutingModule {
}
