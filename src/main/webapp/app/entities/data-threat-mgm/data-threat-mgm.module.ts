import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    DataThreatMgmService,
    DataThreatMgmPopupService,
    DataThreatMgmComponent,
    DataThreatMgmDetailComponent,
    DataThreatMgmDialogComponent,
    DataThreatMgmPopupComponent,
    DataThreatMgmDeletePopupComponent,
    DataThreatMgmDeleteDialogComponent,
    dataThreatRoute,
    dataThreatPopupRoute,
} from './';

const ENTITY_STATES = [
    ...dataThreatRoute,
    ...dataThreatPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DataThreatMgmComponent,
        DataThreatMgmDetailComponent,
        DataThreatMgmDialogComponent,
        DataThreatMgmDeleteDialogComponent,
        DataThreatMgmPopupComponent,
        DataThreatMgmDeletePopupComponent,
    ],
    entryComponents: [
        DataThreatMgmComponent,
        DataThreatMgmDialogComponent,
        DataThreatMgmPopupComponent,
        DataThreatMgmDeleteDialogComponent,
        DataThreatMgmDeletePopupComponent,
    ],
    providers: [
        DataThreatMgmService,
        DataThreatMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutDataThreatMgmModule {}
