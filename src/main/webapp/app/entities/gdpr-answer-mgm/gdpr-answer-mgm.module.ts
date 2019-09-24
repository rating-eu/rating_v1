import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    GDPRAnswerMgmService,
    GDPRAnswerMgmPopupService,
    GDPRAnswerMgmComponent,
    GDPRAnswerMgmDetailComponent,
    GDPRAnswerMgmDialogComponent,
    GDPRAnswerMgmPopupComponent,
    GDPRAnswerMgmDeletePopupComponent,
    GDPRAnswerMgmDeleteDialogComponent,
    gDPRAnswerRoute,
    gDPRAnswerPopupRoute,
} from './';

const ENTITY_STATES = [
    ...gDPRAnswerRoute,
    ...gDPRAnswerPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        GDPRAnswerMgmComponent,
        GDPRAnswerMgmDetailComponent,
        GDPRAnswerMgmDialogComponent,
        GDPRAnswerMgmDeleteDialogComponent,
        GDPRAnswerMgmPopupComponent,
        GDPRAnswerMgmDeletePopupComponent,
    ],
    entryComponents: [
        GDPRAnswerMgmComponent,
        GDPRAnswerMgmDialogComponent,
        GDPRAnswerMgmPopupComponent,
        GDPRAnswerMgmDeleteDialogComponent,
        GDPRAnswerMgmDeletePopupComponent,
    ],
    providers: [
        GDPRAnswerMgmService,
        GDPRAnswerMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutGDPRAnswerMgmModule {}
