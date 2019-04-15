/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HermeneutSharedModule } from '../../shared';
import {
    ImpactLevelDescriptionMgmService,
    ImpactLevelDescriptionMgmPopupService,
    ImpactLevelDescriptionMgmComponent,
    ImpactLevelDescriptionMgmDetailComponent,
    ImpactLevelDescriptionMgmDialogComponent,
    ImpactLevelDescriptionMgmPopupComponent,
    ImpactLevelDescriptionMgmDeletePopupComponent,
    ImpactLevelDescriptionMgmDeleteDialogComponent,
    impactLevelDescriptionRoute,
    impactLevelDescriptionPopupRoute,
} from './';

const ENTITY_STATES = [
    ...impactLevelDescriptionRoute,
    ...impactLevelDescriptionPopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ImpactLevelDescriptionMgmComponent,
        ImpactLevelDescriptionMgmDetailComponent,
        ImpactLevelDescriptionMgmDialogComponent,
        ImpactLevelDescriptionMgmDeleteDialogComponent,
        ImpactLevelDescriptionMgmPopupComponent,
        ImpactLevelDescriptionMgmDeletePopupComponent,
    ],
    entryComponents: [
        ImpactLevelDescriptionMgmComponent,
        ImpactLevelDescriptionMgmDialogComponent,
        ImpactLevelDescriptionMgmPopupComponent,
        ImpactLevelDescriptionMgmDeleteDialogComponent,
        ImpactLevelDescriptionMgmDeletePopupComponent,
    ],
    providers: [
        ImpactLevelDescriptionMgmService,
        ImpactLevelDescriptionMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutImpactLevelDescriptionMgmModule {}
