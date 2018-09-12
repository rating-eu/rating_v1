import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import { HermeneutAdminModule } from '../../admin/admin.module';
import {
    MyCompanyMgmService,
    MyCompanyMgmPopupService,
    MyCompanyMgmComponent,
    MyCompanyMgmDetailComponent,
    MyCompanyMgmDialogComponent,
    MyCompanyMgmPopupComponent,
    MyCompanyMgmDeletePopupComponent,
    MyCompanyMgmDeleteDialogComponent,
    myCompanyRoute,
    myCompanyPopupRoute,
} from './';

const ENTITY_STATES = [
    ...myCompanyRoute,
    ...myCompanyPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        HermeneutAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        MyCompanyMgmComponent,
        MyCompanyMgmDetailComponent,
        MyCompanyMgmDialogComponent,
        MyCompanyMgmDeleteDialogComponent,
        MyCompanyMgmPopupComponent,
        MyCompanyMgmDeletePopupComponent,
    ],
    entryComponents: [
        MyCompanyMgmComponent,
        MyCompanyMgmDialogComponent,
        MyCompanyMgmPopupComponent,
        MyCompanyMgmDeleteDialogComponent,
        MyCompanyMgmDeletePopupComponent,
    ],
    providers: [
        MyCompanyMgmService,
        MyCompanyMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutMyCompanyMgmModule {}
