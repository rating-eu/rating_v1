import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import { HermeneutAdminModule } from '../../admin/admin.module';
import {
    SelfAssessmentMgmService,
    SelfAssessmentMgmPopupService,
    SelfAssessmentMgmComponent,
    SelfAssessmentMgmDetailComponent,
    SelfAssessmentMgmDialogComponent,
    SelfAssessmentMgmPopupComponent,
    SelfAssessmentMgmDeletePopupComponent,
    SelfAssessmentMgmDeleteDialogComponent,
    selfAssessmentRoute,
    selfAssessmentPopupRoute,
} from './';

const ENTITY_STATES = [
    ...selfAssessmentRoute,
    ...selfAssessmentPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        HermeneutAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        SelfAssessmentMgmComponent,
        SelfAssessmentMgmDetailComponent,
        SelfAssessmentMgmDialogComponent,
        SelfAssessmentMgmDeleteDialogComponent,
        SelfAssessmentMgmPopupComponent,
        SelfAssessmentMgmDeletePopupComponent,
    ],
    entryComponents: [
        SelfAssessmentMgmComponent,
        SelfAssessmentMgmDialogComponent,
        SelfAssessmentMgmPopupComponent,
        SelfAssessmentMgmDeleteDialogComponent,
        SelfAssessmentMgmDeletePopupComponent,
    ],
    providers: [
        SelfAssessmentMgmService,
        SelfAssessmentMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutSelfAssessmentMgmModule {}
