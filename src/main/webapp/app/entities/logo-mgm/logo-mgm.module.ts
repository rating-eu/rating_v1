import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    LogoMgmService,
    LogoMgmPopupService,
    LogoMgmComponent,
    LogoMgmDetailComponent,
    LogoMgmDialogComponent,
    LogoMgmPopupComponent,
    LogoMgmDeletePopupComponent,
    LogoMgmDeleteDialogComponent,
    logoRoute,
    logoPopupRoute,
} from './';

const ENTITY_STATES = [
    ...logoRoute,
    ...logoPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LogoMgmComponent,
        LogoMgmDetailComponent,
        LogoMgmDialogComponent,
        LogoMgmDeleteDialogComponent,
        LogoMgmPopupComponent,
        LogoMgmDeletePopupComponent,
    ],
    entryComponents: [
        LogoMgmComponent,
        LogoMgmDialogComponent,
        LogoMgmPopupComponent,
        LogoMgmDeleteDialogComponent,
        LogoMgmDeletePopupComponent,
    ],
    providers: [
        LogoMgmService,
        LogoMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutLogoMgmModule {}
