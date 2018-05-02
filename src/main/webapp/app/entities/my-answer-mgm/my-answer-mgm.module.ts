import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import { HermeneutAdminModule } from '../../admin/admin.module';
import {
    MyAnswerMgmService,
    MyAnswerMgmPopupService,
    MyAnswerMgmComponent,
    MyAnswerMgmDetailComponent,
    MyAnswerMgmDialogComponent,
    MyAnswerMgmPopupComponent,
    MyAnswerMgmDeletePopupComponent,
    MyAnswerMgmDeleteDialogComponent,
    myAnswerRoute,
    myAnswerPopupRoute,
} from './';

const ENTITY_STATES = [
    ...myAnswerRoute,
    ...myAnswerPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        HermeneutAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        MyAnswerMgmComponent,
        MyAnswerMgmDetailComponent,
        MyAnswerMgmDialogComponent,
        MyAnswerMgmDeleteDialogComponent,
        MyAnswerMgmPopupComponent,
        MyAnswerMgmDeletePopupComponent,
    ],
    entryComponents: [
        MyAnswerMgmComponent,
        MyAnswerMgmDialogComponent,
        MyAnswerMgmPopupComponent,
        MyAnswerMgmDeleteDialogComponent,
        MyAnswerMgmDeletePopupComponent,
    ],
    providers: [
        MyAnswerMgmService,
        MyAnswerMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutMyAnswerMgmModule {}
