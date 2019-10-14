import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    OverallSecurityImpactMgmService,
    OverallSecurityImpactMgmPopupService,
    OverallSecurityImpactMgmComponent,
    OverallSecurityImpactMgmDetailComponent,
    OverallSecurityImpactMgmDialogComponent,
    OverallSecurityImpactMgmPopupComponent,
    OverallSecurityImpactMgmDeletePopupComponent,
    OverallSecurityImpactMgmDeleteDialogComponent,
    overallSecurityImpactRoute,
    overallSecurityImpactPopupRoute,
} from './';

const ENTITY_STATES = [
    ...overallSecurityImpactRoute,
    ...overallSecurityImpactPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        OverallSecurityImpactMgmComponent,
        OverallSecurityImpactMgmDetailComponent,
        OverallSecurityImpactMgmDialogComponent,
        OverallSecurityImpactMgmDeleteDialogComponent,
        OverallSecurityImpactMgmPopupComponent,
        OverallSecurityImpactMgmDeletePopupComponent,
    ],
    entryComponents: [
        OverallSecurityImpactMgmComponent,
        OverallSecurityImpactMgmDialogComponent,
        OverallSecurityImpactMgmPopupComponent,
        OverallSecurityImpactMgmDeleteDialogComponent,
        OverallSecurityImpactMgmDeletePopupComponent,
    ],
    providers: [
        OverallSecurityImpactMgmService,
        OverallSecurityImpactMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutOverallSecurityImpactMgmModule {}
