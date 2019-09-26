import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PrivacyRiskAssessmentRoutingModule} from './privacy-risk-assessment-routing.module';
import {DataOperationsComponent} from './data-operations/data-operations.component';
import {DataOperationsService} from './data-operations/data-operations.service';
import {HermeneutSharedModule, JhiLanguageHelper} from '../shared';
import {DataSharingModule} from '../data-sharing/data-sharing.module';
import {JhiEventManager, JhiLanguageService} from 'ng-jhipster';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        DataSharingModule,
        PrivacyRiskAssessmentRoutingModule
    ],
    providers: [
        DataOperationsService,
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
    ],
    declarations: [DataOperationsComponent]
})
export class PrivacyRiskAssessmentModule {
    // Fixes Translation Not Found in Lazy Loading modules
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
