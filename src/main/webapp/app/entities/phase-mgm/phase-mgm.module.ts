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
    PhaseMgmService,
    PhaseMgmPopupService,
    PhaseMgmComponent,
    PhaseMgmDetailComponent,
    PhaseMgmDialogComponent,
    PhaseMgmPopupComponent,
    PhaseMgmDeletePopupComponent,
    PhaseMgmDeleteDialogComponent,
    phaseRoute,
    phasePopupRoute,
} from './';

const ENTITY_STATES = [
    ...phaseRoute,
    ...phasePopupRoute,
];

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PhaseMgmComponent,
        PhaseMgmDetailComponent,
        PhaseMgmDialogComponent,
        PhaseMgmDeleteDialogComponent,
        PhaseMgmPopupComponent,
        PhaseMgmDeletePopupComponent,
    ],
    entryComponents: [
        PhaseMgmComponent,
        PhaseMgmDialogComponent,
        PhaseMgmPopupComponent,
        PhaseMgmDeleteDialogComponent,
        PhaseMgmDeletePopupComponent,
    ],
    providers: [
        PhaseMgmService,
        PhaseMgmPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutPhaseMgmModule {}
