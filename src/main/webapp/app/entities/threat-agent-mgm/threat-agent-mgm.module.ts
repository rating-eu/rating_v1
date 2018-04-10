import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    ThreatAgentMgmService,
    ThreatAgentMgmPopupService,
    ThreatAgentMgmComponent,
    ThreatAgentMgmDetailComponent,
    ThreatAgentMgmDialogComponent,
    ThreatAgentMgmPopupComponent,
    ThreatAgentMgmDeletePopupComponent,
    ThreatAgentMgmDeleteDialogComponent,
    threatAgentRoute,
    threatAgentPopupRoute,
} from './';

const ENTITY_STATES = [
    ...threatAgentRoute,
    ...threatAgentPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ThreatAgentMgmComponent,
        ThreatAgentMgmDetailComponent,
        ThreatAgentMgmDialogComponent,
        ThreatAgentMgmDeleteDialogComponent,
        ThreatAgentMgmPopupComponent,
        ThreatAgentMgmDeletePopupComponent,
    ],
    entryComponents: [
        ThreatAgentMgmComponent,
        ThreatAgentMgmDialogComponent,
        ThreatAgentMgmPopupComponent,
        ThreatAgentMgmDeleteDialogComponent,
        ThreatAgentMgmDeletePopupComponent,
    ],
    providers: [
        ThreatAgentMgmService,
        ThreatAgentMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutThreatAgentMgmModule {}
