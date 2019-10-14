import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    DataOperationMgmService,
    DataOperationMgmPopupService,
    DataOperationMgmComponent,
    DataOperationMgmDetailComponent,
    DataOperationMgmDialogComponent,
    DataOperationMgmPopupComponent,
    DataOperationMgmDeletePopupComponent,
    DataOperationMgmDeleteDialogComponent,
    dataOperationRoute,
    dataOperationPopupRoute,
} from './';

const ENTITY_STATES = [
    ...dataOperationRoute,
    ...dataOperationPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DataOperationMgmComponent,
        DataOperationMgmDetailComponent,
        DataOperationMgmDialogComponent,
        DataOperationMgmDeleteDialogComponent,
        DataOperationMgmPopupComponent,
        DataOperationMgmDeletePopupComponent,
    ],
    entryComponents: [
        DataOperationMgmComponent,
        DataOperationMgmDialogComponent,
        DataOperationMgmPopupComponent,
        DataOperationMgmDeleteDialogComponent,
        DataOperationMgmDeletePopupComponent,
    ],
    providers: [
        DataOperationMgmService,
        DataOperationMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutDataOperationMgmModule {}
