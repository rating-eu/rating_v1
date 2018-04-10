import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import { HermeneutAdminModule } from '../../admin/admin.module';
import {
    ExternalAuditMgmService,
    ExternalAuditMgmPopupService,
    ExternalAuditMgmComponent,
    ExternalAuditMgmDetailComponent,
    ExternalAuditMgmDialogComponent,
    ExternalAuditMgmPopupComponent,
    ExternalAuditMgmDeletePopupComponent,
    ExternalAuditMgmDeleteDialogComponent,
    externalAuditRoute,
    externalAuditPopupRoute,
} from './';

const ENTITY_STATES = [
    ...externalAuditRoute,
    ...externalAuditPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        HermeneutAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ExternalAuditMgmComponent,
        ExternalAuditMgmDetailComponent,
        ExternalAuditMgmDialogComponent,
        ExternalAuditMgmDeleteDialogComponent,
        ExternalAuditMgmPopupComponent,
        ExternalAuditMgmDeletePopupComponent,
    ],
    entryComponents: [
        ExternalAuditMgmComponent,
        ExternalAuditMgmDialogComponent,
        ExternalAuditMgmPopupComponent,
        ExternalAuditMgmDeleteDialogComponent,
        ExternalAuditMgmDeletePopupComponent,
    ],
    providers: [
        ExternalAuditMgmService,
        ExternalAuditMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutExternalAuditMgmModule {}
