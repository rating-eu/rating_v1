import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    ContainerMgmService,
    ContainerMgmPopupService,
    ContainerMgmComponent,
    ContainerMgmDetailComponent,
    ContainerMgmDialogComponent,
    ContainerMgmPopupComponent,
    ContainerMgmDeletePopupComponent,
    ContainerMgmDeleteDialogComponent,
    containerRoute,
    containerPopupRoute,
} from './';

const ENTITY_STATES = [
    ...containerRoute,
    ...containerPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ContainerMgmComponent,
        ContainerMgmDetailComponent,
        ContainerMgmDialogComponent,
        ContainerMgmDeleteDialogComponent,
        ContainerMgmPopupComponent,
        ContainerMgmDeletePopupComponent,
    ],
    entryComponents: [
        ContainerMgmComponent,
        ContainerMgmDialogComponent,
        ContainerMgmPopupComponent,
        ContainerMgmDeleteDialogComponent,
        ContainerMgmDeletePopupComponent,
    ],
    providers: [
        ContainerMgmService,
        ContainerMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutContainerMgmModule {}
