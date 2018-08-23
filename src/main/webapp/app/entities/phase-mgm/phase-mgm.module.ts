import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    PhaseMgmService,
    PhaseMgmPopupService,
    PhaseMgmComponent,
    PhaseMgmDetailComponent,
    PhaseMgmDialogComponent,
    PhaseMgmPopupComponent,
    PhaseMgmDeletePopupComponent,
    PhaseMgmDeleteDialogComponent,
    phaseRoute,
    phasePopupRoute,
} from './';

const ENTITY_STATES = [
    ...phaseRoute,
    ...phasePopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PhaseMgmComponent,
        PhaseMgmDetailComponent,
        PhaseMgmDialogComponent,
        PhaseMgmDeleteDialogComponent,
        PhaseMgmPopupComponent,
        PhaseMgmDeletePopupComponent,
    ],
    entryComponents: [
        PhaseMgmComponent,
        PhaseMgmDialogComponent,
        PhaseMgmPopupComponent,
        PhaseMgmDeleteDialogComponent,
        PhaseMgmDeletePopupComponent,
    ],
    providers: [
        PhaseMgmService,
        PhaseMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutPhaseMgmModule {}
