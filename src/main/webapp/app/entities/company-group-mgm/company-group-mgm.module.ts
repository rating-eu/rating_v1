import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import { HermeneutAdminModule } from '../../admin/admin.module';
import {
    CompanyGroupMgmService,
    CompanyGroupMgmPopupService,
    CompanyGroupMgmComponent,
    CompanyGroupMgmDetailComponent,
    CompanyGroupMgmDialogComponent,
    CompanyGroupMgmPopupComponent,
    CompanyGroupMgmDeletePopupComponent,
    CompanyGroupMgmDeleteDialogComponent,
    companyGroupRoute,
    companyGroupPopupRoute,
} from './';

const ENTITY_STATES = [
    ...companyGroupRoute,
    ...companyGroupPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        HermeneutAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CompanyGroupMgmComponent,
        CompanyGroupMgmDetailComponent,
        CompanyGroupMgmDialogComponent,
        CompanyGroupMgmDeleteDialogComponent,
        CompanyGroupMgmPopupComponent,
        CompanyGroupMgmDeletePopupComponent,
    ],
    entryComponents: [
        CompanyGroupMgmComponent,
        CompanyGroupMgmDialogComponent,
        CompanyGroupMgmPopupComponent,
        CompanyGroupMgmDeleteDialogComponent,
        CompanyGroupMgmDeletePopupComponent,
    ],
    providers: [
        CompanyGroupMgmService,
        CompanyGroupMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutCompanyGroupMgmModule {}
