import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    MotivationMgmService,
    MotivationMgmPopupService,
    MotivationMgmComponent,
    MotivationMgmDetailComponent,
    MotivationMgmDialogComponent,
    MotivationMgmPopupComponent,
    MotivationMgmDeletePopupComponent,
    MotivationMgmDeleteDialogComponent,
    motivationRoute,
    motivationPopupRoute,
} from './';

const ENTITY_STATES = [
    ...motivationRoute,
    ...motivationPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        MotivationMgmComponent,
        MotivationMgmDetailComponent,
        MotivationMgmDialogComponent,
        MotivationMgmDeleteDialogComponent,
        MotivationMgmPopupComponent,
        MotivationMgmDeletePopupComponent,
    ],
    entryComponents: [
        MotivationMgmComponent,
        MotivationMgmDialogComponent,
        MotivationMgmPopupComponent,
        MotivationMgmDeleteDialogComponent,
        MotivationMgmDeletePopupComponent,
    ],
    providers: [
        MotivationMgmService,
        MotivationMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutMotivationMgmModule {}
