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

import {NgModule, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, LOCALE_ID} from '@angular/core';
import {DatePipe, registerLocaleData} from '@angular/common';
import locale from '@angular/common/locales/en';

import {
    HermeneutSharedLibsModule,
    HermeneutSharedCommonModule,
    CSRFService,
    AuthServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    LoginModalService,
    JhiLoginModalComponent,
    Principal,
    HasAnyAuthorityDirective,
    FindLanguageFromKeyPipe,
    JhiLanguageHelper
} from './';

import {Title} from '@angular/platform-browser';
import {LoginPlainComponent} from './index';
import { PopUpService } from './pop-up-services/pop-up.service';
import { ReplacePipe } from './pipe/replace.pipe';

@NgModule({
    imports: [
        HermeneutSharedLibsModule,
        HermeneutSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        FindLanguageFromKeyPipe,
        LoginPlainComponent,
        ReplacePipe
    ],
    providers: [
        LoginService,
        LoginModalService,
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        UserService,
        DatePipe
    ],
    entryComponents: [JhiLoginModalComponent, LoginPlainComponent],
    exports: [
        HermeneutSharedCommonModule,
        JhiLoginModalComponent,
        FindLanguageFromKeyPipe,
        HasAnyAuthorityDirective,
        DatePipe,
        LoginPlainComponent,
        ReplacePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class HermeneutSharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HermeneutSharedModule,
            providers: [
                JhiLanguageHelper,
                Principal,
                LoginService,
                AuthServerProvider,
                UserService,
                AccountService,
                StateStorageService,
                PopUpService,
                LoginModalService,
                Title,
                {
                    provide: LOCALE_ID,
                    useValue: 'en'
                }
            ]
        };
    }

    constructor() {
        registerLocaleData(locale);
    }
}
