import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    DomainOfInfluenceMgmService,
    DomainOfInfluenceMgmPopupService,
    DomainOfInfluenceMgmComponent,
    DomainOfInfluenceMgmDetailComponent,
    DomainOfInfluenceMgmDialogComponent,
    DomainOfInfluenceMgmPopupComponent,
    DomainOfInfluenceMgmDeletePopupComponent,
    DomainOfInfluenceMgmDeleteDialogComponent,
    domainOfInfluenceRoute,
    domainOfInfluencePopupRoute,
} from './';

const ENTITY_STATES = [
    ...domainOfInfluenceRoute,
    ...domainOfInfluencePopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        DomainOfInfluenceMgmComponent,
        DomainOfInfluenceMgmDetailComponent,
        DomainOfInfluenceMgmDialogComponent,
        DomainOfInfluenceMgmDeleteDialogComponent,
        DomainOfInfluenceMgmPopupComponent,
        DomainOfInfluenceMgmDeletePopupComponent,
    ],
    entryComponents: [
        DomainOfInfluenceMgmComponent,
        DomainOfInfluenceMgmDialogComponent,
        DomainOfInfluenceMgmPopupComponent,
        DomainOfInfluenceMgmDeleteDialogComponent,
        DomainOfInfluenceMgmDeletePopupComponent,
    ],
    providers: [
        DomainOfInfluenceMgmService,
        DomainOfInfluenceMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutDomainOfInfluenceMgmModule {}
