import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    SecurityImpactMgmService,
    SecurityImpactMgmPopupService,
    SecurityImpactMgmComponent,
    SecurityImpactMgmDetailComponent,
    SecurityImpactMgmDialogComponent,
    SecurityImpactMgmPopupComponent,
    SecurityImpactMgmDeletePopupComponent,
    SecurityImpactMgmDeleteDialogComponent,
    securityImpactRoute,
    securityImpactPopupRoute,
} from './';

const ENTITY_STATES = [
    ...securityImpactRoute,
    ...securityImpactPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SecurityImpactMgmComponent,
        SecurityImpactMgmDetailComponent,
        SecurityImpactMgmDialogComponent,
        SecurityImpactMgmDeleteDialogComponent,
        SecurityImpactMgmPopupComponent,
        SecurityImpactMgmDeletePopupComponent,
    ],
    entryComponents: [
        SecurityImpactMgmComponent,
        SecurityImpactMgmDialogComponent,
        SecurityImpactMgmPopupComponent,
        SecurityImpactMgmDeleteDialogComponent,
        SecurityImpactMgmDeletePopupComponent,
    ],
    providers: [
        SecurityImpactMgmService,
        SecurityImpactMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutSecurityImpactMgmModule {}
