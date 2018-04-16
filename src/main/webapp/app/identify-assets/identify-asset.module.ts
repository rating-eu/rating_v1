import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import { IdentifyAssetsRoutingModule } from './identify-assets-routing.module';
import { IdentifyAssetComponent } from './id-assets/identify-asset.component';

@NgModule({
    imports: [
        CommonModule,
        IdentifyAssetsRoutingModule

    ],
    declarations: [
        IdentifyAssetComponent,
    ],
    exports: [
        IdentifyAssetComponent
    ]
})
export class IdentifyAssetModule { }
