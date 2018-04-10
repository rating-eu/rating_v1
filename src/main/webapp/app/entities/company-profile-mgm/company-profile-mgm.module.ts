import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import { HermeneutAdminModule } from '../../admin/admin.module';
import {
    CompanyProfileMgmService,
    CompanyProfileMgmPopupService,
    CompanyProfileMgmComponent,
    CompanyProfileMgmDetailComponent,
    CompanyProfileMgmDialogComponent,
    CompanyProfileMgmPopupComponent,
    CompanyProfileMgmDeletePopupComponent,
    CompanyProfileMgmDeleteDialogComponent,
    companyProfileRoute,
    companyProfilePopupRoute,
} from './';

const ENTITY_STATES = [
    ...companyProfileRoute,
    ...companyProfilePopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        HermeneutAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CompanyProfileMgmComponent,
        CompanyProfileMgmDetailComponent,
        CompanyProfileMgmDialogComponent,
        CompanyProfileMgmDeleteDialogComponent,
        CompanyProfileMgmPopupComponent,
        CompanyProfileMgmDeletePopupComponent,
    ],
    entryComponents: [
        CompanyProfileMgmComponent,
        CompanyProfileMgmDialogComponent,
        CompanyProfileMgmPopupComponent,
        CompanyProfileMgmDeleteDialogComponent,
        CompanyProfileMgmDeletePopupComponent,
    ],
    providers: [
        CompanyProfileMgmService,
        CompanyProfileMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutCompanyProfileMgmModule {}
