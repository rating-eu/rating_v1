import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    EBITMgmService,
    EBITMgmPopupService,
    EBITMgmComponent,
    EBITMgmDetailComponent,
    EBITMgmDialogComponent,
    EBITMgmPopupComponent,
    EBITMgmDeletePopupComponent,
    EBITMgmDeleteDialogComponent,
    eBITRoute,
    eBITPopupRoute,
} from './';

const ENTITY_STATES = [
    ...eBITRoute,
    ...eBITPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        EBITMgmComponent,
        EBITMgmDetailComponent,
        EBITMgmDialogComponent,
        EBITMgmDeleteDialogComponent,
        EBITMgmPopupComponent,
        EBITMgmDeletePopupComponent,
    ],
    entryComponents: [
        EBITMgmComponent,
        EBITMgmDialogComponent,
        EBITMgmPopupComponent,
        EBITMgmDeleteDialogComponent,
        EBITMgmDeletePopupComponent,
    ],
    providers: [
        EBITMgmService,
        EBITMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutEBITMgmModule {}
