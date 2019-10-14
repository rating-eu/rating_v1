import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    DataRecipientMgmService,
    DataRecipientMgmPopupService,
    DataRecipientMgmComponent,
    DataRecipientMgmDetailComponent,
    DataRecipientMgmDialogComponent,
    DataRecipientMgmPopupComponent,
    DataRecipientMgmDeletePopupComponent,
    DataRecipientMgmDeleteDialogComponent,
    dataRecipientRoute,
    dataRecipientPopupRoute,
} from './';

const ENTITY_STATES = [
    ...dataRecipientRoute,
    ...dataRecipientPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DataRecipientMgmComponent,
        DataRecipientMgmDetailComponent,
        DataRecipientMgmDialogComponent,
        DataRecipientMgmDeleteDialogComponent,
        DataRecipientMgmPopupComponent,
        DataRecipientMgmDeletePopupComponent,
    ],
    entryComponents: [
        DataRecipientMgmComponent,
        DataRecipientMgmDialogComponent,
        DataRecipientMgmPopupComponent,
        DataRecipientMgmDeleteDialogComponent,
        DataRecipientMgmDeletePopupComponent,
    ],
    providers: [
        DataRecipientMgmService,
        DataRecipientMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutDataRecipientMgmModule {}
