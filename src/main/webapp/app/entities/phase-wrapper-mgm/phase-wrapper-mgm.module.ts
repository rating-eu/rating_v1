import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    PhaseWrapperMgmService,
    PhaseWrapperMgmPopupService,
    PhaseWrapperMgmComponent,
    PhaseWrapperMgmDetailComponent,
    PhaseWrapperMgmDialogComponent,
    PhaseWrapperMgmPopupComponent,
    PhaseWrapperMgmDeletePopupComponent,
    PhaseWrapperMgmDeleteDialogComponent,
    phaseWrapperRoute,
    phaseWrapperPopupRoute,
} from './';

const ENTITY_STATES = [
    ...phaseWrapperRoute,
    ...phaseWrapperPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PhaseWrapperMgmComponent,
        PhaseWrapperMgmDetailComponent,
        PhaseWrapperMgmDialogComponent,
        PhaseWrapperMgmDeleteDialogComponent,
        PhaseWrapperMgmPopupComponent,
        PhaseWrapperMgmDeletePopupComponent,
    ],
    entryComponents: [
        PhaseWrapperMgmComponent,
        PhaseWrapperMgmDialogComponent,
        PhaseWrapperMgmPopupComponent,
        PhaseWrapperMgmDeleteDialogComponent,
        PhaseWrapperMgmDeletePopupComponent,
    ],
    providers: [
        PhaseWrapperMgmService,
        PhaseWrapperMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutPhaseWrapperMgmModule {}
