import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    SplittingLossMgmService,
    SplittingLossMgmPopupService,
    SplittingLossMgmComponent,
    SplittingLossMgmDetailComponent,
    SplittingLossMgmDialogComponent,
    SplittingLossMgmPopupComponent,
    SplittingLossMgmDeletePopupComponent,
    SplittingLossMgmDeleteDialogComponent,
    splittingLossRoute,
    splittingLossPopupRoute,
} from './';

const ENTITY_STATES = [
    ...splittingLossRoute,
    ...splittingLossPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SplittingLossMgmComponent,
        SplittingLossMgmDetailComponent,
        SplittingLossMgmDialogComponent,
        SplittingLossMgmDeleteDialogComponent,
        SplittingLossMgmPopupComponent,
        SplittingLossMgmDeletePopupComponent,
    ],
    entryComponents: [
        SplittingLossMgmComponent,
        SplittingLossMgmDialogComponent,
        SplittingLossMgmPopupComponent,
        SplittingLossMgmDeleteDialogComponent,
        SplittingLossMgmDeletePopupComponent,
    ],
    providers: [
        SplittingLossMgmService,
        SplittingLossMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutSplittingLossMgmModule {}
