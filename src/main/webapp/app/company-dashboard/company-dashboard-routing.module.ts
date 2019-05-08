import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserRouteAccessService} from "../shared";
import {EntryPointComponent} from "./entry-point/entry-point.component";

const routes: Routes = [
    {
        path: '',
        component: EntryPointComponent,
        data: {
            pageTitle: 'hermeneutApp.dashboardSection.page.dashboard.title',
            authorities: ['ROLE_CISO'],
        },
        canActivate: [UserRouteAccessService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyDashboardRoutingModule {
}
