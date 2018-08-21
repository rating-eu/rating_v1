import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    LikelihoodScaleMgmService,
    LikelihoodScaleMgmPopupService,
    LikelihoodScaleMgmComponent,
    LikelihoodScaleMgmDetailComponent,
    LikelihoodScaleMgmDialogComponent,
    LikelihoodScaleMgmPopupComponent,
    LikelihoodScaleMgmDeletePopupComponent,
    LikelihoodScaleMgmDeleteDialogComponent,
    likelihoodScaleRoute,
    likelihoodScalePopupRoute,
} from './';

const ENTITY_STATES = [
    ...likelihoodScaleRoute,
    ...likelihoodScalePopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LikelihoodScaleMgmComponent,
        LikelihoodScaleMgmDetailComponent,
        LikelihoodScaleMgmDialogComponent,
        LikelihoodScaleMgmDeleteDialogComponent,
        LikelihoodScaleMgmPopupComponent,
        LikelihoodScaleMgmDeletePopupComponent,
    ],
    entryComponents: [
        LikelihoodScaleMgmComponent,
        LikelihoodScaleMgmDialogComponent,
        LikelihoodScaleMgmPopupComponent,
        LikelihoodScaleMgmDeleteDialogComponent,
        LikelihoodScaleMgmDeletePopupComponent,
    ],
    providers: [
        LikelihoodScaleMgmService,
        LikelihoodScaleMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutLikelihoodScaleMgmModule {}
