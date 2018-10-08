import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    ImpactLevelMgmService,
    ImpactLevelMgmPopupService,
    ImpactLevelMgmComponent,
    ImpactLevelMgmDetailComponent,
    ImpactLevelMgmDialogComponent,
    ImpactLevelMgmPopupComponent,
    ImpactLevelMgmDeletePopupComponent,
    ImpactLevelMgmDeleteDialogComponent,
    impactLevelRoute,
    impactLevelPopupRoute,
} from './';

const ENTITY_STATES = [
    ...impactLevelRoute,
    ...impactLevelPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ImpactLevelMgmComponent,
        ImpactLevelMgmDetailComponent,
        ImpactLevelMgmDialogComponent,
        ImpactLevelMgmDeleteDialogComponent,
        ImpactLevelMgmPopupComponent,
        ImpactLevelMgmDeletePopupComponent,
    ],
    entryComponents: [
        ImpactLevelMgmComponent,
        ImpactLevelMgmDialogComponent,
        ImpactLevelMgmPopupComponent,
        ImpactLevelMgmDeleteDialogComponent,
        ImpactLevelMgmDeletePopupComponent,
    ],
    providers: [
        ImpactLevelMgmService,
        ImpactLevelMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutImpactLevelMgmModule {}
