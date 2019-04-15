/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
