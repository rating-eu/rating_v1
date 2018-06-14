import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    AnswerWeightMgmService,
    AnswerWeightMgmPopupService,
    AnswerWeightMgmComponent,
    AnswerWeightMgmDetailComponent,
    AnswerWeightMgmDialogComponent,
    AnswerWeightMgmPopupComponent,
    AnswerWeightMgmDeletePopupComponent,
    AnswerWeightMgmDeleteDialogComponent,
    answerWeightRoute,
    answerWeightPopupRoute,
} from './';
import {MaterialModule} from '../../material/material.module';

const ENTITY_STATES = [
    ...answerWeightRoute,
    ...answerWeightPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        MaterialModule
    ],
    declarations: [
        AnswerWeightMgmComponent,
        AnswerWeightMgmDetailComponent,
        AnswerWeightMgmDialogComponent,
        AnswerWeightMgmDeleteDialogComponent,
        AnswerWeightMgmPopupComponent,
        AnswerWeightMgmDeletePopupComponent,
    ],
    entryComponents: [
        AnswerWeightMgmComponent,
        AnswerWeightMgmDialogComponent,
        AnswerWeightMgmPopupComponent,
        AnswerWeightMgmDeleteDialogComponent,
        AnswerWeightMgmDeletePopupComponent,
    ],
    providers: [
        AnswerWeightMgmService,
        AnswerWeightMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutAnswerWeightMgmModule {}
