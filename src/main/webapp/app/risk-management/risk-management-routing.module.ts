import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RiskManagementComponent } from './risk-management/risk-management.component';
import { RiskEvaluationComponent } from './risk-evaluation/risk-evaluation.component';
import { RiskMitigationComponent } from './risk-mitigation/risk-mitigation.component';

const routes: Routes = [
  {
      path: '',
      component: RiskManagementComponent,
      children: [
          {
              path: 'risk-evaluation',
              component: RiskEvaluationComponent,
          },
          {
              path: 'risk-mitigation',
              component: RiskMitigationComponent
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskManagementRoutingModule { }
