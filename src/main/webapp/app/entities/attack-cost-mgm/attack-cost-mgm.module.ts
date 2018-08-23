import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    AttackCostMgmService,
    AttackCostMgmPopupService,
    AttackCostMgmComponent,
    AttackCostMgmDetailComponent,
    AttackCostMgmDialogComponent,
    AttackCostMgmPopupComponent,
    AttackCostMgmDeletePopupComponent,
    AttackCostMgmDeleteDialogComponent,
    attackCostRoute,
    attackCostPopupRoute,
} from './';

const ENTITY_STATES = [
    ...attackCostRoute,
    ...attackCostPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        AttackCostMgmComponent,
        AttackCostMgmDetailComponent,
        AttackCostMgmDialogComponent,
        AttackCostMgmDeleteDialogComponent,
        AttackCostMgmPopupComponent,
        AttackCostMgmDeletePopupComponent,
    ],
    entryComponents: [
        AttackCostMgmComponent,
        AttackCostMgmDialogComponent,
        AttackCostMgmPopupComponent,
        AttackCostMgmDeleteDialogComponent,
        AttackCostMgmDeletePopupComponent,
    ],
    providers: [
        AttackCostMgmService,
        AttackCostMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutAttackCostMgmModule {}
