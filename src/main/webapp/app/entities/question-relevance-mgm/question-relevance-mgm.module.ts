import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    QuestionRelevanceMgmService,
    QuestionRelevanceMgmPopupService,
    QuestionRelevanceMgmComponent,
    QuestionRelevanceMgmDetailComponent,
    QuestionRelevanceMgmDialogComponent,
    QuestionRelevanceMgmPopupComponent,
    QuestionRelevanceMgmDeletePopupComponent,
    QuestionRelevanceMgmDeleteDialogComponent,
    questionRelevanceRoute,
    questionRelevancePopupRoute,
} from './';

const ENTITY_STATES = [
    ...questionRelevanceRoute,
    ...questionRelevancePopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        QuestionRelevanceMgmComponent,
        QuestionRelevanceMgmDetailComponent,
        QuestionRelevanceMgmDialogComponent,
        QuestionRelevanceMgmDeleteDialogComponent,
        QuestionRelevanceMgmPopupComponent,
        QuestionRelevanceMgmDeletePopupComponent,
    ],
    entryComponents: [
        QuestionRelevanceMgmComponent,
        QuestionRelevanceMgmDialogComponent,
        QuestionRelevanceMgmPopupComponent,
        QuestionRelevanceMgmDeleteDialogComponent,
        QuestionRelevanceMgmDeletePopupComponent,
    ],
    providers: [
        QuestionRelevanceMgmService,
        QuestionRelevanceMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutQuestionRelevanceMgmModule {}
