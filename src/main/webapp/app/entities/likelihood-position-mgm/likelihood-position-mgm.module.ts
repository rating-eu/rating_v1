import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    LikelihoodPositionMgmService,
    LikelihoodPositionMgmPopupService,
    LikelihoodPositionMgmComponent,
    LikelihoodPositionMgmDetailComponent,
    LikelihoodPositionMgmDialogComponent,
    LikelihoodPositionMgmPopupComponent,
    LikelihoodPositionMgmDeletePopupComponent,
    LikelihoodPositionMgmDeleteDialogComponent,
    likelihoodPositionRoute,
    likelihoodPositionPopupRoute,
} from './';

const ENTITY_STATES = [
    ...likelihoodPositionRoute,
    ...likelihoodPositionPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LikelihoodPositionMgmComponent,
        LikelihoodPositionMgmDetailComponent,
        LikelihoodPositionMgmDialogComponent,
        LikelihoodPositionMgmDeleteDialogComponent,
        LikelihoodPositionMgmPopupComponent,
        LikelihoodPositionMgmDeletePopupComponent,
    ],
    entryComponents: [
        LikelihoodPositionMgmComponent,
        LikelihoodPositionMgmDialogComponent,
        LikelihoodPositionMgmPopupComponent,
        LikelihoodPositionMgmDeleteDialogComponent,
        LikelihoodPositionMgmDeletePopupComponent,
    ],
    providers: [
        LikelihoodPositionMgmService,
        LikelihoodPositionMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutLikelihoodPositionMgmModule {}
