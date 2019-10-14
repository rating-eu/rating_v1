import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import { HermeneutAdminModule } from '../../admin/admin.module';
import {
    GDPRQuestionnaireStatusMgmService,
    GDPRQuestionnaireStatusMgmPopupService,
    GDPRQuestionnaireStatusMgmComponent,
    GDPRQuestionnaireStatusMgmDetailComponent,
    GDPRQuestionnaireStatusMgmDialogComponent,
    GDPRQuestionnaireStatusMgmPopupComponent,
    GDPRQuestionnaireStatusMgmDeletePopupComponent,
    GDPRQuestionnaireStatusMgmDeleteDialogComponent,
    gDPRQuestionnaireStatusRoute,
    gDPRQuestionnaireStatusPopupRoute,
} from './';

const ENTITY_STATES = [
    ...gDPRQuestionnaireStatusRoute,
    ...gDPRQuestionnaireStatusPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        HermeneutAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        GDPRQuestionnaireStatusMgmComponent,
        GDPRQuestionnaireStatusMgmDetailComponent,
        GDPRQuestionnaireStatusMgmDialogComponent,
        GDPRQuestionnaireStatusMgmDeleteDialogComponent,
        GDPRQuestionnaireStatusMgmPopupComponent,
        GDPRQuestionnaireStatusMgmDeletePopupComponent,
    ],
    entryComponents: [
        GDPRQuestionnaireStatusMgmComponent,
        GDPRQuestionnaireStatusMgmDialogComponent,
        GDPRQuestionnaireStatusMgmPopupComponent,
        GDPRQuestionnaireStatusMgmDeleteDialogComponent,
        GDPRQuestionnaireStatusMgmDeletePopupComponent,
    ],
    providers: [
        GDPRQuestionnaireStatusMgmService,
        GDPRQuestionnaireStatusMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutGDPRQuestionnaireStatusMgmModule {}
