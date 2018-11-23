import { AttackCostsComponent } from './attack-costs/attack-costs.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentifyAssetComponent } from './id-assets/identify-asset.component';
import { AssetClusteringComponent } from './asset-clustering/asset-clustering.component';
import { MagnitudeComponent } from './magnitude/magnitude.component';
import { CascadeEffectsComponent } from './cascade-effects/cascade-effects.component';
import { AssetReportComponent } from './asset-report/asset-report.component';

const routes: Routes = [
    /*
    {
        path: '',
        component: IdentifyAssetComponent,
        data: {
            pageTitle: 'hermeneutApp.assetSection.page.assetIdentification.title'
        }
    },
    */
    {
        path: 'asset-clustering',
        component: AssetClusteringComponent,
        data: {
            pageTitle: 'hermeneutApp.assetSection.page.assetClustering.title'
        }
    },
    {
        path: 'magnitude',
        component: MagnitudeComponent,
        data: {
            pageTitle: 'hermeneutApp.assetSection.page.magnitude.title'
        }
    },
    {
        path: 'cascade-effects',
        component: CascadeEffectsComponent,
        data: {
            pageTitle: 'hermeneutApp.assetSection.page.cascadeEffects.title'
        }
    },
    {
        path: 'attack-costs',
        component: AttackCostsComponent,
        data: {
            pageTitle: 'hermeneutApp.assetSection.page.attackCosts.title'
        }
    },
    {
        path: 'asset-report',
        component: AssetReportComponent,
        data: {
            pageTitle: 'hermeneutApp.assetSection.page.assetReport.title'
        }
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
