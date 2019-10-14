import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    TranslationMgmService,
    TranslationMgmPopupService,
    TranslationMgmComponent,
    TranslationMgmDetailComponent,
    TranslationMgmDialogComponent,
    TranslationMgmPopupComponent,
    TranslationMgmDeletePopupComponent,
    TranslationMgmDeleteDialogComponent,
    translationRoute,
    translationPopupRoute,
} from './';

const ENTITY_STATES = [
    ...translationRoute,
    ...translationPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        TranslationMgmComponent,
        TranslationMgmDetailComponent,
        TranslationMgmDialogComponent,
        TranslationMgmDeleteDialogComponent,
        TranslationMgmPopupComponent,
        TranslationMgmDeletePopupComponent,
    ],
    entryComponents: [
        TranslationMgmComponent,
        TranslationMgmDialogComponent,
        TranslationMgmPopupComponent,
        TranslationMgmDeleteDialogComponent,
        TranslationMgmDeletePopupComponent,
    ],
    providers: [
        TranslationMgmService,
        TranslationMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutTranslationMgmModule {}
