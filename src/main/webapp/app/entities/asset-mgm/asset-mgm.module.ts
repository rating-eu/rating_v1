import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    AssetMgmService,
    AssetMgmPopupService,
    AssetMgmComponent,
    AssetMgmDetailComponent,
    AssetMgmDialogComponent,
    AssetMgmPopupComponent,
    AssetMgmDeletePopupComponent,
    AssetMgmDeleteDialogComponent,
    assetRoute,
    assetPopupRoute,
} from './';

const ENTITY_STATES = [
    ...assetRoute,
    ...assetPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        AssetMgmComponent,
        AssetMgmDetailComponent,
        AssetMgmDialogComponent,
        AssetMgmDeleteDialogComponent,
        AssetMgmPopupComponent,
        AssetMgmDeletePopupComponent,
    ],
    entryComponents: [
        AssetMgmComponent,
        AssetMgmDialogComponent,
        AssetMgmPopupComponent,
        AssetMgmDeleteDialogComponent,
        AssetMgmDeletePopupComponent,
    ],
    providers: [
        AssetMgmService,
        AssetMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutAssetMgmModule {}
