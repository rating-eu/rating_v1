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

@NgModule({
    imports: [
        HermeneutSharedLibsModule,
        HermeneutSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        FindLanguageFromKeyPipe
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
    entryComponents: [JhiLoginModalComponent],
    exports: [
        HermeneutSharedCommonModule,
        JhiLoginModalComponent,
        FindLanguageFromKeyPipe,
        HasAnyAuthorityDirective,
        DatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class HermeneutSharedModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HermeneutSharedModule,
            providers: [
                JhiLanguageHelper,
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
