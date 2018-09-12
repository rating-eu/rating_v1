import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MyCompanyRoutingModule} from './my-company-routing.module';
import {MyCompanyComponent} from './my-company.component';
import {FormsModule} from '@angular/forms';
import {HermeneutSharedModule, JhiLanguageHelper} from '../shared';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import {JhiEventManager, JhiLanguageService} from 'ng-jhipster';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        FormsModule,
        MyCompanyRoutingModule
    ],
    declarations: [MyCompanyComponent],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
            deps: [
                LocalStorageService,
                SessionStorageService
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true,
            deps: [
                Injector
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
            deps: [
                JhiEventManager
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true,
            deps: [
                Injector
            ]
        }
    ]
})
export class MyCompanyModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language
            .subscribe((languageKey: string) => {
                this.languageService.changeLanguage(languageKey)
            });
    }
}
