import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import { HermeneutAdminModule } from '../../admin/admin.module';
import {
    CompanySectorMgmService,
    CompanySectorMgmPopupService,
    CompanySectorMgmComponent,
    CompanySectorMgmDetailComponent,
    CompanySectorMgmDialogComponent,
    CompanySectorMgmPopupComponent,
    CompanySectorMgmDeletePopupComponent,
    CompanySectorMgmDeleteDialogComponent,
    companySectorRoute,
    companySectorPopupRoute,
} from './';

const ENTITY_STATES = [
    ...companySectorRoute,
    ...companySectorPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        HermeneutAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CompanySectorMgmComponent,
        CompanySectorMgmDetailComponent,
        CompanySectorMgmDialogComponent,
        CompanySectorMgmDeleteDialogComponent,
        CompanySectorMgmPopupComponent,
        CompanySectorMgmDeletePopupComponent,
    ],
    entryComponents: [
        CompanySectorMgmComponent,
        CompanySectorMgmDialogComponent,
        CompanySectorMgmPopupComponent,
        CompanySectorMgmDeleteDialogComponent,
        CompanySectorMgmDeletePopupComponent,
    ],
    providers: [
        CompanySectorMgmService,
        CompanySectorMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutCompanySectorMgmModule {}
