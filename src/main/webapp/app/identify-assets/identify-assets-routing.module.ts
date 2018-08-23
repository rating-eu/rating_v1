import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentifyAssetComponent } from './id-assets/identify-asset.component';

const routes: Routes = [
    {
        path: '',
        component: IdentifyAssetComponent,
        data: {
            pageTitle: 'hermeneutApp.identifyAsset.home.title'
        }
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

export class IdentifyAssetsRoutingModule {
}
