import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    QuestionMgmService,
    QuestionMgmPopupService,
    QuestionMgmComponent,
    QuestionMgmDetailComponent,
    QuestionMgmDialogComponent,
    QuestionMgmPopupComponent,
    QuestionMgmDeletePopupComponent,
    QuestionMgmDeleteDialogComponent,
    questionRoute,
    questionPopupRoute,
} from './';

const ENTITY_STATES = [
    ...questionRoute,
    ...questionPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        QuestionMgmComponent,
        QuestionMgmDetailComponent,
        QuestionMgmDialogComponent,
        QuestionMgmDeleteDialogComponent,
        QuestionMgmPopupComponent,
        QuestionMgmDeletePopupComponent,
    ],
    entryComponents: [
        QuestionMgmComponent,
        QuestionMgmDialogComponent,
        QuestionMgmPopupComponent,
        QuestionMgmDeleteDialogComponent,
        QuestionMgmDeletePopupComponent,
    ],
    providers: [
        QuestionMgmService,
        QuestionMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutQuestionMgmModule {}
