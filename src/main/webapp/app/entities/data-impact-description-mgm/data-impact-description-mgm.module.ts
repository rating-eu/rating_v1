import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    DataImpactDescriptionMgmService,
    DataImpactDescriptionMgmPopupService,
    DataImpactDescriptionMgmComponent,
    DataImpactDescriptionMgmDetailComponent,
    DataImpactDescriptionMgmDialogComponent,
    DataImpactDescriptionMgmPopupComponent,
    DataImpactDescriptionMgmDeletePopupComponent,
    DataImpactDescriptionMgmDeleteDialogComponent,
    dataImpactDescriptionRoute,
    dataImpactDescriptionPopupRoute,
} from './';

const ENTITY_STATES = [
    ...dataImpactDescriptionRoute,
    ...dataImpactDescriptionPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DataImpactDescriptionMgmComponent,
        DataImpactDescriptionMgmDetailComponent,
        DataImpactDescriptionMgmDialogComponent,
        DataImpactDescriptionMgmDeleteDialogComponent,
        DataImpactDescriptionMgmPopupComponent,
        DataImpactDescriptionMgmDeletePopupComponent,
    ],
    entryComponents: [
        DataImpactDescriptionMgmComponent,
        DataImpactDescriptionMgmDialogComponent,
        DataImpactDescriptionMgmPopupComponent,
        DataImpactDescriptionMgmDeleteDialogComponent,
        DataImpactDescriptionMgmDeletePopupComponent,
    ],
    providers: [
        DataImpactDescriptionMgmService,
        DataImpactDescriptionMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutDataImpactDescriptionMgmModule {}
