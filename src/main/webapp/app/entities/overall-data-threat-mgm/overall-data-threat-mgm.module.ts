import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    OverallDataThreatMgmService,
    OverallDataThreatMgmPopupService,
    OverallDataThreatMgmComponent,
    OverallDataThreatMgmDetailComponent,
    OverallDataThreatMgmDialogComponent,
    OverallDataThreatMgmPopupComponent,
    OverallDataThreatMgmDeletePopupComponent,
    OverallDataThreatMgmDeleteDialogComponent,
    overallDataThreatRoute,
    overallDataThreatPopupRoute,
} from './';

const ENTITY_STATES = [
    ...overallDataThreatRoute,
    ...overallDataThreatPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        OverallDataThreatMgmComponent,
        OverallDataThreatMgmDetailComponent,
        OverallDataThreatMgmDialogComponent,
        OverallDataThreatMgmDeleteDialogComponent,
        OverallDataThreatMgmPopupComponent,
        OverallDataThreatMgmDeletePopupComponent,
    ],
    entryComponents: [
        OverallDataThreatMgmComponent,
        OverallDataThreatMgmDialogComponent,
        OverallDataThreatMgmPopupComponent,
        OverallDataThreatMgmDeleteDialogComponent,
        OverallDataThreatMgmDeletePopupComponent,
    ],
    providers: [
        OverallDataThreatMgmService,
        OverallDataThreatMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutOverallDataThreatMgmModule {}
