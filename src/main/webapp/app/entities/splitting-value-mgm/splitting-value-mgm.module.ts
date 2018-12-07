import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    SplittingValueMgmService,
    SplittingValueMgmPopupService,
    SplittingValueMgmComponent,
    SplittingValueMgmDetailComponent,
    SplittingValueMgmDialogComponent,
    SplittingValueMgmPopupComponent,
    SplittingValueMgmDeletePopupComponent,
    SplittingValueMgmDeleteDialogComponent,
    splittingValueRoute,
    splittingValuePopupRoute,
} from './';

const ENTITY_STATES = [
    ...splittingValueRoute,
    ...splittingValuePopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SplittingValueMgmComponent,
        SplittingValueMgmDetailComponent,
        SplittingValueMgmDialogComponent,
        SplittingValueMgmDeleteDialogComponent,
        SplittingValueMgmPopupComponent,
        SplittingValueMgmDeletePopupComponent,
    ],
    entryComponents: [
        SplittingValueMgmComponent,
        SplittingValueMgmDialogComponent,
        SplittingValueMgmPopupComponent,
        SplittingValueMgmDeleteDialogComponent,
        SplittingValueMgmDeletePopupComponent,
    ],
    providers: [
        SplittingValueMgmService,
        SplittingValueMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutSplittingValueMgmModule {}
