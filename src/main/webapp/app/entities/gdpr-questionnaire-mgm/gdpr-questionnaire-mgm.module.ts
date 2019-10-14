import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    GDPRQuestionnaireMgmService,
    GDPRQuestionnaireMgmPopupService,
    GDPRQuestionnaireMgmComponent,
    GDPRQuestionnaireMgmDetailComponent,
    GDPRQuestionnaireMgmDialogComponent,
    GDPRQuestionnaireMgmPopupComponent,
    GDPRQuestionnaireMgmDeletePopupComponent,
    GDPRQuestionnaireMgmDeleteDialogComponent,
    gDPRQuestionnaireRoute,
    gDPRQuestionnairePopupRoute,
} from './';

const ENTITY_STATES = [
    ...gDPRQuestionnaireRoute,
    ...gDPRQuestionnairePopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        GDPRQuestionnaireMgmComponent,
        GDPRQuestionnaireMgmDetailComponent,
        GDPRQuestionnaireMgmDialogComponent,
        GDPRQuestionnaireMgmDeleteDialogComponent,
        GDPRQuestionnaireMgmPopupComponent,
        GDPRQuestionnaireMgmDeletePopupComponent,
    ],
    entryComponents: [
        GDPRQuestionnaireMgmComponent,
        GDPRQuestionnaireMgmDialogComponent,
        GDPRQuestionnaireMgmPopupComponent,
        GDPRQuestionnaireMgmDeleteDialogComponent,
        GDPRQuestionnaireMgmDeletePopupComponent,
    ],
    providers: [
        GDPRQuestionnaireMgmService,
        GDPRQuestionnaireMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutGDPRQuestionnaireMgmModule {}
