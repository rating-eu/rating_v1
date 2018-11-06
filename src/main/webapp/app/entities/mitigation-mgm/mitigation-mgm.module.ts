import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    MitigationMgmService,
    MitigationMgmPopupService,
    MitigationMgmComponent,
    MitigationMgmDetailComponent,
    MitigationMgmDialogComponent,
    MitigationMgmPopupComponent,
    MitigationMgmDeletePopupComponent,
    MitigationMgmDeleteDialogComponent,
    mitigationRoute,
    mitigationPopupRoute,
} from './';

const ENTITY_STATES = [
    ...mitigationRoute,
    ...mitigationPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    exports: [
        MitigationMgmComponent,
        MitigationMgmDetailComponent,
        MitigationMgmDialogComponent,
        MitigationMgmPopupComponent,
        MitigationMgmDeletePopupComponent,
        MitigationMgmDeleteDialogComponent
    ],
    declarations: [
        MitigationMgmComponent,
        MitigationMgmDetailComponent,
        MitigationMgmDialogComponent,
        MitigationMgmDeleteDialogComponent,
        MitigationMgmPopupComponent,
        MitigationMgmDeletePopupComponent,
    ],
    entryComponents: [
        MitigationMgmComponent,
        MitigationMgmDialogComponent,
        MitigationMgmPopupComponent,
        MitigationMgmDeleteDialogComponent,
        MitigationMgmDeletePopupComponent,
    ],
    providers: [
        MitigationMgmService,
        MitigationMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutMitigationMgmModule {}
