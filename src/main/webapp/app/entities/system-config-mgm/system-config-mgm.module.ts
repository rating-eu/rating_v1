import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    SystemConfigMgmService,
    SystemConfigMgmPopupService,
    SystemConfigMgmComponent,
    SystemConfigMgmDetailComponent,
    SystemConfigMgmDialogComponent,
    SystemConfigMgmPopupComponent,
    SystemConfigMgmDeletePopupComponent,
    SystemConfigMgmDeleteDialogComponent,
    systemConfigRoute,
    systemConfigPopupRoute,
} from './';

const ENTITY_STATES = [
    ...systemConfigRoute,
    ...systemConfigPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SystemConfigMgmComponent,
        SystemConfigMgmDetailComponent,
        SystemConfigMgmDialogComponent,
        SystemConfigMgmDeleteDialogComponent,
        SystemConfigMgmPopupComponent,
        SystemConfigMgmDeletePopupComponent,
    ],
    entryComponents: [
        SystemConfigMgmComponent,
        SystemConfigMgmDialogComponent,
        SystemConfigMgmPopupComponent,
        SystemConfigMgmDeleteDialogComponent,
        SystemConfigMgmDeletePopupComponent,
    ],
    providers: [
        SystemConfigMgmService,
        SystemConfigMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutSystemConfigMgmModule {}
