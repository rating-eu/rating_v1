import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    OverallDataRiskMgmService,
    OverallDataRiskMgmPopupService,
    OverallDataRiskMgmComponent,
    OverallDataRiskMgmDetailComponent,
    OverallDataRiskMgmDialogComponent,
    OverallDataRiskMgmPopupComponent,
    OverallDataRiskMgmDeletePopupComponent,
    OverallDataRiskMgmDeleteDialogComponent,
    overallDataRiskRoute,
    overallDataRiskPopupRoute,
} from './';

const ENTITY_STATES = [
    ...overallDataRiskRoute,
    ...overallDataRiskPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        OverallDataRiskMgmComponent,
        OverallDataRiskMgmDetailComponent,
        OverallDataRiskMgmDialogComponent,
        OverallDataRiskMgmDeleteDialogComponent,
        OverallDataRiskMgmPopupComponent,
        OverallDataRiskMgmDeletePopupComponent,
    ],
    entryComponents: [
        OverallDataRiskMgmComponent,
        OverallDataRiskMgmDialogComponent,
        OverallDataRiskMgmPopupComponent,
        OverallDataRiskMgmDeleteDialogComponent,
        OverallDataRiskMgmDeletePopupComponent,
    ],
    providers: [
        OverallDataRiskMgmService,
        OverallDataRiskMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutOverallDataRiskMgmModule {}
