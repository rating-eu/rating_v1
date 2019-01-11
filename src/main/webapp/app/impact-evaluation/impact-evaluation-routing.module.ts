import { AttackRelatedCostsEstimationComponent } from './attack-related-costs-estimation/attack-related-costs-estimation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImpactEvaluationComponent } from './impact-evaluation/impact-evaluation.component';

const routes: Routes = [
  {
    path: '',
    component: ImpactEvaluationComponent,
    data: {
      pageTitle: 'hermeneutApp.impactEvaluation.home.title'
    }
  },
  {
    path: 'attack-related-costs-estimation',
    component: AttackRelatedCostsEstimationComponent,
    data: {
      pageTitle: 'hermeneutApp.attackRelatedCostsEstimation.home.title'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImpactEvaluationRoutingModule { }
