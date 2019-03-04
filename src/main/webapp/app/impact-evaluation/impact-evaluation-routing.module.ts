import { GrowthRatesConfiguratorComponentComponent } from './growth-rates-configurator-component/growth-rates-configurator-component.component';
import { AttackRelatedCostsEstimationComponent } from './attack-related-costs-estimation/attack-related-costs-estimation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImpactEvaluationComponent } from './impact-evaluation/impact-evaluation.component';
import { UserRouteAccessService } from '../shared';
import { DataAssetsLossesEstimationComponent } from './data-assets-losses-estimation/data-assets-losses-estimation.component';

const routes: Routes = [
  {
    path: '',
    component: ImpactEvaluationComponent,
    data: {
      pageTitle: 'hermeneutApp.impactEvaluation.home.title',
      authorities: ['ROLE_CISO'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'attack-related-costs-estimation',
    component: AttackRelatedCostsEstimationComponent,
    data: {
      pageTitle: 'hermeneutApp.attackRelatedCostsEstimation.home.title',
      authorities: ['ROLE_CISO'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'data-assets-losses-estimation',
    component: DataAssetsLossesEstimationComponent,
    data: {
      pageTitle: 'hermeneutApp.dataAssetsLossesEstimation.home.title',
      authorities: ['ROLE_CISO'],
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'growth-rates-configurator',
    component: GrowthRatesConfiguratorComponentComponent,
    data: {
      pageTitle: 'hermeneutApp.growthRatesConfigurator.home.title',
      authorities: ['ROLE_CISO'],
    },
    canActivate: [UserRouteAccessService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImpactEvaluationRoutingModule { }
