import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    EconomicCoefficientsMgmService,
    EconomicCoefficientsMgmPopupService,
    EconomicCoefficientsMgmComponent,
    EconomicCoefficientsMgmDetailComponent,
    EconomicCoefficientsMgmDialogComponent,
    EconomicCoefficientsMgmPopupComponent,
    EconomicCoefficientsMgmDeletePopupComponent,
    EconomicCoefficientsMgmDeleteDialogComponent,
    economicCoefficientsRoute,
    economicCoefficientsPopupRoute,
} from './';

const ENTITY_STATES = [
    ...economicCoefficientsRoute,
    ...economicCoefficientsPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        EconomicCoefficientsMgmComponent,
        EconomicCoefficientsMgmDetailComponent,
        EconomicCoefficientsMgmDialogComponent,
        EconomicCoefficientsMgmDeleteDialogComponent,
        EconomicCoefficientsMgmPopupComponent,
        EconomicCoefficientsMgmDeletePopupComponent,
    ],
    entryComponents: [
        EconomicCoefficientsMgmComponent,
        EconomicCoefficientsMgmDialogComponent,
        EconomicCoefficientsMgmPopupComponent,
        EconomicCoefficientsMgmDeleteDialogComponent,
        EconomicCoefficientsMgmDeletePopupComponent,
    ],
    providers: [
        EconomicCoefficientsMgmService,
        EconomicCoefficientsMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutEconomicCoefficientsMgmModule {}
