import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IdentifyAssetsRoutingModule } from './identify-assets-routing.module';
import { AssetListComponent } from './asset-list/asset-list.component';

@NgModule({
  imports: [
    CommonModule,
    IdentifyAssetsRoutingModule
  ],
  declarations: [AssetListComponent]
})
export class IdentifyAssetsModule { }
