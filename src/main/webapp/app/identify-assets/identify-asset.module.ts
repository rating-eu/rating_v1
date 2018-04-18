import { NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { IdentifyAssetsRoutingModule } from './identify-assets-routing.module';
import { IdentifyAssetComponent } from './id-assets/identify-asset.component';

@NgModule({
    imports: [
        CommonModule,
        IdentifyAssetsRoutingModule

    ],
    declarations: [
        IdentifyAssetComponent
    ],
    exports: [
        IdentifyAssetComponent
    ]
})
export class IdentifyAssetModule { }
