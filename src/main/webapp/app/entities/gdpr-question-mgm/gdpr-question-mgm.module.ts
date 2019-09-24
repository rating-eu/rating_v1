import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    GDPRQuestionMgmService,
    GDPRQuestionMgmPopupService,
    GDPRQuestionMgmComponent,
    GDPRQuestionMgmDetailComponent,
    GDPRQuestionMgmDialogComponent,
    GDPRQuestionMgmPopupComponent,
    GDPRQuestionMgmDeletePopupComponent,
    GDPRQuestionMgmDeleteDialogComponent,
    gDPRQuestionRoute,
    gDPRQuestionPopupRoute,
} from './';

const ENTITY_STATES = [
    ...gDPRQuestionRoute,
    ...gDPRQuestionPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        GDPRQuestionMgmComponent,
        GDPRQuestionMgmDetailComponent,
        GDPRQuestionMgmDialogComponent,
        GDPRQuestionMgmDeleteDialogComponent,
        GDPRQuestionMgmPopupComponent,
        GDPRQuestionMgmDeletePopupComponent,
    ],
    entryComponents: [
        GDPRQuestionMgmComponent,
        GDPRQuestionMgmDialogComponent,
        GDPRQuestionMgmPopupComponent,
        GDPRQuestionMgmDeleteDialogComponent,
        GDPRQuestionMgmDeletePopupComponent,
    ],
    providers: [
        GDPRQuestionMgmService,
        GDPRQuestionMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutGDPRQuestionMgmModule {}
