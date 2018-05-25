import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    LevelMgmService,
    LevelMgmPopupService,
    LevelMgmComponent,
    LevelMgmDetailComponent,
    LevelMgmDialogComponent,
    LevelMgmPopupComponent,
    LevelMgmDeletePopupComponent,
    LevelMgmDeleteDialogComponent,
    levelRoute,
    levelPopupRoute,
} from './';

const ENTITY_STATES = [
    ...levelRoute,
    ...levelPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LevelMgmComponent,
        LevelMgmDetailComponent,
        LevelMgmDialogComponent,
        LevelMgmDeleteDialogComponent,
        LevelMgmPopupComponent,
        LevelMgmDeletePopupComponent,
    ],
    entryComponents: [
        LevelMgmComponent,
        LevelMgmDialogComponent,
        LevelMgmPopupComponent,
        LevelMgmDeleteDialogComponent,
        LevelMgmDeletePopupComponent,
    ],
    providers: [
        LevelMgmService,
        LevelMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutLevelMgmModule {}
