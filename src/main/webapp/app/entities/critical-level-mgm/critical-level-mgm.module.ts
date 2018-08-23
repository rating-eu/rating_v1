import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    CriticalLevelMgmService,
    CriticalLevelMgmPopupService,
    CriticalLevelMgmComponent,
    CriticalLevelMgmDetailComponent,
    CriticalLevelMgmDialogComponent,
    CriticalLevelMgmPopupComponent,
    CriticalLevelMgmDeletePopupComponent,
    CriticalLevelMgmDeleteDialogComponent,
    criticalLevelRoute,
    criticalLevelPopupRoute,
} from './';

const ENTITY_STATES = [
    ...criticalLevelRoute,
    ...criticalLevelPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CriticalLevelMgmComponent,
        CriticalLevelMgmDetailComponent,
        CriticalLevelMgmDialogComponent,
        CriticalLevelMgmDeleteDialogComponent,
        CriticalLevelMgmPopupComponent,
        CriticalLevelMgmDeletePopupComponent,
    ],
    entryComponents: [
        CriticalLevelMgmComponent,
        CriticalLevelMgmDialogComponent,
        CriticalLevelMgmPopupComponent,
        CriticalLevelMgmDeleteDialogComponent,
        CriticalLevelMgmDeletePopupComponent,
    ],
    providers: [
        CriticalLevelMgmService,
        CriticalLevelMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutCriticalLevelMgmModule {}
