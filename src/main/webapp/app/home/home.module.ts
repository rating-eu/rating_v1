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

import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {HermeneutSharedModule} from '../shared';

import {HOME_ROUTES, HomeComponent} from './';
import {MaterialModule} from '../material/material.module';
import {AboutUsComponent} from './about.us.component';
import {TermsOfUseComponent} from './terms-of-use/terms-of-use.component';

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(HOME_ROUTES),
        MaterialModule
    ],
    exports: [
        AboutUsComponent,
        TermsOfUseComponent
    ],
    declarations: [
        HomeComponent,
        AboutUsComponent,
        TermsOfUseComponent
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutHomeModule {
}
