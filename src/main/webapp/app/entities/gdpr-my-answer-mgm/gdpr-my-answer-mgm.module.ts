import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    GDPRMyAnswerMgmService,
    GDPRMyAnswerMgmPopupService,
    GDPRMyAnswerMgmComponent,
    GDPRMyAnswerMgmDetailComponent,
    GDPRMyAnswerMgmDialogComponent,
    GDPRMyAnswerMgmPopupComponent,
    GDPRMyAnswerMgmDeletePopupComponent,
    GDPRMyAnswerMgmDeleteDialogComponent,
    gDPRMyAnswerRoute,
    gDPRMyAnswerPopupRoute,
} from './';

const ENTITY_STATES = [
    ...gDPRMyAnswerRoute,
    ...gDPRMyAnswerPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        GDPRMyAnswerMgmComponent,
        GDPRMyAnswerMgmDetailComponent,
        GDPRMyAnswerMgmDialogComponent,
        GDPRMyAnswerMgmDeleteDialogComponent,
        GDPRMyAnswerMgmPopupComponent,
        GDPRMyAnswerMgmDeletePopupComponent,
    ],
    entryComponents: [
        GDPRMyAnswerMgmComponent,
        GDPRMyAnswerMgmDialogComponent,
        GDPRMyAnswerMgmPopupComponent,
        GDPRMyAnswerMgmDeleteDialogComponent,
        GDPRMyAnswerMgmDeletePopupComponent,
    ],
    providers: [
        GDPRMyAnswerMgmService,
        GDPRMyAnswerMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutGDPRMyAnswerMgmModule {}
