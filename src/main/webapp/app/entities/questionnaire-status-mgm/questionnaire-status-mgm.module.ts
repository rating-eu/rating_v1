import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import { HermeneutAdminModule } from '../../admin/admin.module';
import {
    QuestionnaireStatusMgmService,
    QuestionnaireStatusMgmPopupService,
    QuestionnaireStatusMgmComponent,
    QuestionnaireStatusMgmDetailComponent,
    QuestionnaireStatusMgmDialogComponent,
    QuestionnaireStatusMgmPopupComponent,
    QuestionnaireStatusMgmDeletePopupComponent,
    QuestionnaireStatusMgmDeleteDialogComponent,
    questionnaireStatusRoute,
    questionnaireStatusPopupRoute,
} from './';

const ENTITY_STATES = [
    ...questionnaireStatusRoute,
    ...questionnaireStatusPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        HermeneutAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        QuestionnaireStatusMgmComponent,
        QuestionnaireStatusMgmDetailComponent,
        QuestionnaireStatusMgmDialogComponent,
        QuestionnaireStatusMgmDeleteDialogComponent,
        QuestionnaireStatusMgmPopupComponent,
        QuestionnaireStatusMgmDeletePopupComponent,
    ],
    entryComponents: [
        QuestionnaireStatusMgmComponent,
        QuestionnaireStatusMgmDialogComponent,
        QuestionnaireStatusMgmPopupComponent,
        QuestionnaireStatusMgmDeleteDialogComponent,
        QuestionnaireStatusMgmDeletePopupComponent,
    ],
    providers: [
        QuestionnaireStatusMgmService,
        QuestionnaireStatusMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutQuestionnaireStatusMgmModule {}
