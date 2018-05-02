import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    LevelWrapperMgmService,
    LevelWrapperMgmPopupService,
    LevelWrapperMgmComponent,
    LevelWrapperMgmDetailComponent,
    LevelWrapperMgmDialogComponent,
    LevelWrapperMgmPopupComponent,
    LevelWrapperMgmDeletePopupComponent,
    LevelWrapperMgmDeleteDialogComponent,
    levelWrapperRoute,
    levelWrapperPopupRoute,
} from './';

const ENTITY_STATES = [
    ...levelWrapperRoute,
    ...levelWrapperPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LevelWrapperMgmComponent,
        LevelWrapperMgmDetailComponent,
        LevelWrapperMgmDialogComponent,
        LevelWrapperMgmDeleteDialogComponent,
        LevelWrapperMgmPopupComponent,
        LevelWrapperMgmDeletePopupComponent,
    ],
    entryComponents: [
        LevelWrapperMgmComponent,
        LevelWrapperMgmDialogComponent,
        LevelWrapperMgmPopupComponent,
        LevelWrapperMgmDeleteDialogComponent,
        LevelWrapperMgmDeletePopupComponent,
    ],
    providers: [
        LevelWrapperMgmService,
        LevelWrapperMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutLevelWrapperMgmModule {}
