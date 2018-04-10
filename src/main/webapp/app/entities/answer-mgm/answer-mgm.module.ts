import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    AnswerMgmService,
    AnswerMgmPopupService,
    AnswerMgmComponent,
    AnswerMgmDetailComponent,
    AnswerMgmDialogComponent,
    AnswerMgmPopupComponent,
    AnswerMgmDeletePopupComponent,
    AnswerMgmDeleteDialogComponent,
    answerRoute,
    answerPopupRoute,
} from './';

const ENTITY_STATES = [
    ...answerRoute,
    ...answerPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        AnswerMgmComponent,
        AnswerMgmDetailComponent,
        AnswerMgmDialogComponent,
        AnswerMgmDeleteDialogComponent,
        AnswerMgmPopupComponent,
        AnswerMgmDeletePopupComponent,
    ],
    entryComponents: [
        AnswerMgmComponent,
        AnswerMgmDialogComponent,
        AnswerMgmPopupComponent,
        AnswerMgmDeleteDialogComponent,
        AnswerMgmDeletePopupComponent,
    ],
    providers: [
        AnswerMgmService,
        AnswerMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutAnswerMgmModule {}
