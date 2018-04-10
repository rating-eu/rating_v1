import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    AssetCategoryMgmService,
    AssetCategoryMgmPopupService,
    AssetCategoryMgmComponent,
    AssetCategoryMgmDetailComponent,
    AssetCategoryMgmDialogComponent,
    AssetCategoryMgmPopupComponent,
    AssetCategoryMgmDeletePopupComponent,
    AssetCategoryMgmDeleteDialogComponent,
    assetCategoryRoute,
    assetCategoryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...assetCategoryRoute,
    ...assetCategoryPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        AssetCategoryMgmComponent,
        AssetCategoryMgmDetailComponent,
        AssetCategoryMgmDialogComponent,
        AssetCategoryMgmDeleteDialogComponent,
        AssetCategoryMgmPopupComponent,
        AssetCategoryMgmDeletePopupComponent,
    ],
    entryComponents: [
        AssetCategoryMgmComponent,
        AssetCategoryMgmDialogComponent,
        AssetCategoryMgmPopupComponent,
        AssetCategoryMgmDeleteDialogComponent,
        AssetCategoryMgmDeletePopupComponent,
    ],
    providers: [
        AssetCategoryMgmService,
        AssetCategoryMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutAssetCategoryMgmModule {}
