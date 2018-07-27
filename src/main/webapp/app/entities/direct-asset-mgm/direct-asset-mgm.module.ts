import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    DirectAssetMgmService,
    DirectAssetMgmPopupService,
    DirectAssetMgmComponent,
    DirectAssetMgmDetailComponent,
    DirectAssetMgmDialogComponent,
    DirectAssetMgmPopupComponent,
    DirectAssetMgmDeletePopupComponent,
    DirectAssetMgmDeleteDialogComponent,
    directAssetRoute,
    directAssetPopupRoute,
} from './';

const ENTITY_STATES = [
    ...directAssetRoute,
    ...directAssetPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DirectAssetMgmComponent,
        DirectAssetMgmDetailComponent,
        DirectAssetMgmDialogComponent,
        DirectAssetMgmDeleteDialogComponent,
        DirectAssetMgmPopupComponent,
        DirectAssetMgmDeletePopupComponent,
    ],
    entryComponents: [
        DirectAssetMgmComponent,
        DirectAssetMgmDialogComponent,
        DirectAssetMgmPopupComponent,
        DirectAssetMgmDeleteDialogComponent,
        DirectAssetMgmDeletePopupComponent,
    ],
    providers: [
        DirectAssetMgmService,
        DirectAssetMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutDirectAssetMgmModule {}
