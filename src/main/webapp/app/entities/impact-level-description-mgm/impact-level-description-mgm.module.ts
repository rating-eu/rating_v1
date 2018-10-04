import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    ImpactLevelDescriptionMgmService,
    ImpactLevelDescriptionMgmPopupService,
    ImpactLevelDescriptionMgmComponent,
    ImpactLevelDescriptionMgmDetailComponent,
    ImpactLevelDescriptionMgmDialogComponent,
    ImpactLevelDescriptionMgmPopupComponent,
    ImpactLevelDescriptionMgmDeletePopupComponent,
    ImpactLevelDescriptionMgmDeleteDialogComponent,
    impactLevelDescriptionRoute,
    impactLevelDescriptionPopupRoute,
} from './';

const ENTITY_STATES = [
    ...impactLevelDescriptionRoute,
    ...impactLevelDescriptionPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ImpactLevelDescriptionMgmComponent,
        ImpactLevelDescriptionMgmDetailComponent,
        ImpactLevelDescriptionMgmDialogComponent,
        ImpactLevelDescriptionMgmDeleteDialogComponent,
        ImpactLevelDescriptionMgmPopupComponent,
        ImpactLevelDescriptionMgmDeletePopupComponent,
    ],
    entryComponents: [
        ImpactLevelDescriptionMgmComponent,
        ImpactLevelDescriptionMgmDialogComponent,
        ImpactLevelDescriptionMgmPopupComponent,
        ImpactLevelDescriptionMgmDeleteDialogComponent,
        ImpactLevelDescriptionMgmDeletePopupComponent,
    ],
    providers: [
        ImpactLevelDescriptionMgmService,
        ImpactLevelDescriptionMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutImpactLevelDescriptionMgmModule {}
