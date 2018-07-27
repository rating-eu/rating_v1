import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    IndirectAssetMgmService,
    IndirectAssetMgmPopupService,
    IndirectAssetMgmComponent,
    IndirectAssetMgmDetailComponent,
    IndirectAssetMgmDialogComponent,
    IndirectAssetMgmPopupComponent,
    IndirectAssetMgmDeletePopupComponent,
    IndirectAssetMgmDeleteDialogComponent,
    indirectAssetRoute,
    indirectAssetPopupRoute,
} from './';

const ENTITY_STATES = [
    ...indirectAssetRoute,
    ...indirectAssetPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        IndirectAssetMgmComponent,
        IndirectAssetMgmDetailComponent,
        IndirectAssetMgmDialogComponent,
        IndirectAssetMgmDeleteDialogComponent,
        IndirectAssetMgmPopupComponent,
        IndirectAssetMgmDeletePopupComponent,
    ],
    entryComponents: [
        IndirectAssetMgmComponent,
        IndirectAssetMgmDialogComponent,
        IndirectAssetMgmPopupComponent,
        IndirectAssetMgmDeleteDialogComponent,
        IndirectAssetMgmDeletePopupComponent,
    ],
    providers: [
        IndirectAssetMgmService,
        IndirectAssetMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutIndirectAssetMgmModule {}
