import { AttackCostsComponent } from './attack-costs/attack-costs.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetClusteringComponent } from './asset-clustering/asset-clustering.component';
import { CascadeEffectsComponent } from './cascade-effects/cascade-effects.component';
import { AssetReportComponent } from './asset-report/asset-report.component';
import { UserRouteAccessService } from '../shared';

const routes: Routes = [
    {
        path: 'asset-clustering',
        component: AssetClusteringComponent,
        data: {
            pageTitle: 'hermeneutApp.assetSection.page.assetClustering.title',
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'cascade-effects',
        component: CascadeEffectsComponent,
        data: {
            pageTitle: 'hermeneutApp.assetSection.page.cascadeEffects.title',
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'attack-costs',
        component: AttackCostsComponent,
        data: {
            pageTitle: 'hermeneutApp.assetSection.page.attackCosts.title',
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'asset-report',
        component: AssetReportComponent,
        data: {
            pageTitle: 'hermeneutApp.assetSection.page.assetReport.title',
            authorities: ['ROLE_CISO']
        },
        canActivate: [UserRouteAccessService]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class IdentifyAssetsRoutingModule {
}
