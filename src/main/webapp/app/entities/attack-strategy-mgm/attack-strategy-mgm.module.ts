import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    AttackStrategyMgmService,
    AttackStrategyMgmPopupService,
    AttackStrategyMgmComponent,
    AttackStrategyMgmDetailComponent,
    AttackStrategyMgmDialogComponent,
    AttackStrategyMgmPopupComponent,
    AttackStrategyMgmDeletePopupComponent,
    AttackStrategyMgmDeleteDialogComponent,
    attackStrategyRoute,
    attackStrategyPopupRoute,
} from './';

const ENTITY_STATES = [
    ...attackStrategyRoute,
    ...attackStrategyPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    exports: [
        AttackStrategyMgmComponent,
        AttackStrategyMgmDetailComponent,
        AttackStrategyMgmDialogComponent,
        AttackStrategyMgmPopupComponent,
        AttackStrategyMgmDeletePopupComponent,
        AttackStrategyMgmDeleteDialogComponent,
    ],
    declarations: [
        AttackStrategyMgmComponent,
        AttackStrategyMgmDetailComponent,
        AttackStrategyMgmDialogComponent,
        AttackStrategyMgmDeleteDialogComponent,
        AttackStrategyMgmPopupComponent,
        AttackStrategyMgmDeletePopupComponent,
    ],
    entryComponents: [
        AttackStrategyMgmComponent,
        AttackStrategyMgmDialogComponent,
        AttackStrategyMgmPopupComponent,
        AttackStrategyMgmDeleteDialogComponent,
        AttackStrategyMgmDeletePopupComponent,
    ],
    providers: [
        AttackStrategyMgmService,
        AttackStrategyMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutAttackStrategyMgmModule {}
