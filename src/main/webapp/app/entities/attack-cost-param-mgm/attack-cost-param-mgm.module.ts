import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    AttackCostParamMgmService,
    AttackCostParamMgmPopupService,
    AttackCostParamMgmComponent,
    AttackCostParamMgmDetailComponent,
    AttackCostParamMgmDialogComponent,
    AttackCostParamMgmPopupComponent,
    AttackCostParamMgmDeletePopupComponent,
    AttackCostParamMgmDeleteDialogComponent,
    attackCostParamRoute,
    attackCostParamPopupRoute,
} from './';

const ENTITY_STATES = [
    ...attackCostParamRoute,
    ...attackCostParamPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        AttackCostParamMgmComponent,
        AttackCostParamMgmDetailComponent,
        AttackCostParamMgmDialogComponent,
        AttackCostParamMgmDeleteDialogComponent,
        AttackCostParamMgmPopupComponent,
        AttackCostParamMgmDeletePopupComponent,
    ],
    entryComponents: [
        AttackCostParamMgmComponent,
        AttackCostParamMgmDialogComponent,
        AttackCostParamMgmPopupComponent,
        AttackCostParamMgmDeleteDialogComponent,
        AttackCostParamMgmDeletePopupComponent,
    ],
    providers: [
        AttackCostParamMgmService,
        AttackCostParamMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutAttackCostParamMgmModule {}
