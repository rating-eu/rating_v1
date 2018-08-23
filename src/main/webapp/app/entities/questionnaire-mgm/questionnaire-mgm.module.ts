import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    QuestionnaireMgmService,
    QuestionnaireMgmPopupService,
    QuestionnaireMgmComponent,
    QuestionnaireMgmDetailComponent,
    QuestionnaireMgmDialogComponent,
    QuestionnaireMgmPopupComponent,
    QuestionnaireMgmDeletePopupComponent,
    QuestionnaireMgmDeleteDialogComponent,
    questionnaireRoute,
    questionnairePopupRoute,
} from './';

const ENTITY_STATES = [
    ...questionnaireRoute,
    ...questionnairePopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        QuestionnaireMgmComponent,
        QuestionnaireMgmDetailComponent,
        QuestionnaireMgmDialogComponent,
        QuestionnaireMgmDeleteDialogComponent,
        QuestionnaireMgmPopupComponent,
        QuestionnaireMgmDeletePopupComponent,
    ],
    entryComponents: [
        QuestionnaireMgmComponent,
        QuestionnaireMgmDialogComponent,
        QuestionnaireMgmPopupComponent,
        QuestionnaireMgmDeleteDialogComponent,
        QuestionnaireMgmDeletePopupComponent,
    ],
    providers: [
        QuestionnaireMgmService,
        QuestionnaireMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutQuestionnaireMgmModule {}
