import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import { HermeneutAdminModule } from '../../admin/admin.module';
import {
    DepartmentMgmService,
    DepartmentMgmPopupService,
    DepartmentMgmComponent,
    DepartmentMgmDetailComponent,
    DepartmentMgmDialogComponent,
    DepartmentMgmPopupComponent,
    DepartmentMgmDeletePopupComponent,
    DepartmentMgmDeleteDialogComponent,
    departmentRoute,
    departmentPopupRoute,
} from './';

const ENTITY_STATES = [
    ...departmentRoute,
    ...departmentPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        HermeneutAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DepartmentMgmComponent,
        DepartmentMgmDetailComponent,
        DepartmentMgmDialogComponent,
        DepartmentMgmDeleteDialogComponent,
        DepartmentMgmPopupComponent,
        DepartmentMgmDeletePopupComponent,
    ],
    entryComponents: [
        DepartmentMgmComponent,
        DepartmentMgmDialogComponent,
        DepartmentMgmPopupComponent,
        DepartmentMgmDeleteDialogComponent,
        DepartmentMgmDeletePopupComponent,
    ],
    providers: [
        DepartmentMgmService,
        DepartmentMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutDepartmentMgmModule {}
