import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    MyAssetMgmService,
    MyAssetMgmPopupService,
    MyAssetMgmComponent,
    MyAssetMgmDetailComponent,
    MyAssetMgmDialogComponent,
    MyAssetMgmPopupComponent,
    MyAssetMgmDeletePopupComponent,
    MyAssetMgmDeleteDialogComponent,
    myAssetRoute,
    myAssetPopupRoute,
} from './';

const ENTITY_STATES = [
    ...myAssetRoute,
    ...myAssetPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        MyAssetMgmComponent,
        MyAssetMgmDetailComponent,
        MyAssetMgmDialogComponent,
        MyAssetMgmDeleteDialogComponent,
        MyAssetMgmPopupComponent,
        MyAssetMgmDeletePopupComponent,
    ],
    entryComponents: [
        MyAssetMgmComponent,
        MyAssetMgmDialogComponent,
        MyAssetMgmPopupComponent,
        MyAssetMgmDeleteDialogComponent,
        MyAssetMgmDeletePopupComponent,
    ],
    providers: [
        MyAssetMgmService,
        MyAssetMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutMyAssetMgmModule {}
