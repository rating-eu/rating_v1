import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    EconomicResultsMgmService,
    EconomicResultsMgmPopupService,
    EconomicResultsMgmComponent,
    EconomicResultsMgmDetailComponent,
    EconomicResultsMgmDialogComponent,
    EconomicResultsMgmPopupComponent,
    EconomicResultsMgmDeletePopupComponent,
    EconomicResultsMgmDeleteDialogComponent,
    economicResultsRoute,
    economicResultsPopupRoute,
} from './';

const ENTITY_STATES = [
    ...economicResultsRoute,
    ...economicResultsPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        EconomicResultsMgmComponent,
        EconomicResultsMgmDetailComponent,
        EconomicResultsMgmDialogComponent,
        EconomicResultsMgmDeleteDialogComponent,
        EconomicResultsMgmPopupComponent,
        EconomicResultsMgmDeletePopupComponent,
    ],
    entryComponents: [
        EconomicResultsMgmComponent,
        EconomicResultsMgmDialogComponent,
        EconomicResultsMgmPopupComponent,
        EconomicResultsMgmDeleteDialogComponent,
        EconomicResultsMgmDeletePopupComponent,
    ],
    providers: [
        EconomicResultsMgmService,
        EconomicResultsMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutEconomicResultsMgmModule {}
