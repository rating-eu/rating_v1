import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardOneComponent } from './dashboard-one/dashboard-one.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardOneComponent,
    data: {
      pageTitle: 'hermeneutApp.dashboardSection.page.dashboard.title'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
