import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    DataRiskLevelConfigMgmService,
    DataRiskLevelConfigMgmPopupService,
    DataRiskLevelConfigMgmComponent,
    DataRiskLevelConfigMgmDetailComponent,
    DataRiskLevelConfigMgmDialogComponent,
    DataRiskLevelConfigMgmPopupComponent,
    DataRiskLevelConfigMgmDeletePopupComponent,
    DataRiskLevelConfigMgmDeleteDialogComponent,
    dataRiskLevelConfigRoute,
    dataRiskLevelConfigPopupRoute,
} from './';

const ENTITY_STATES = [
    ...dataRiskLevelConfigRoute,
    ...dataRiskLevelConfigPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DataRiskLevelConfigMgmComponent,
        DataRiskLevelConfigMgmDetailComponent,
        DataRiskLevelConfigMgmDialogComponent,
        DataRiskLevelConfigMgmDeleteDialogComponent,
        DataRiskLevelConfigMgmPopupComponent,
        DataRiskLevelConfigMgmDeletePopupComponent,
    ],
    entryComponents: [
        DataRiskLevelConfigMgmComponent,
        DataRiskLevelConfigMgmDialogComponent,
        DataRiskLevelConfigMgmPopupComponent,
        DataRiskLevelConfigMgmDeleteDialogComponent,
        DataRiskLevelConfigMgmDeletePopupComponent,
    ],
    providers: [
        DataRiskLevelConfigMgmService,
        DataRiskLevelConfigMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutDataRiskLevelConfigMgmModule {}
