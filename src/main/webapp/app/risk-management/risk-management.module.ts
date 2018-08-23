import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RiskManagementRoutingModule} from './risk-management-routing.module';
import {RiskManagementComponent} from './risk-management/risk-management.component';
import {RiskManagementService} from './risk-management.service';
import {RiskEvaluationComponent} from './risk-evaluation/risk-evaluation.component';
import {RiskMitigationComponent} from './risk-mitigation/risk-mitigation.component';
import {NgbCollapseModule} from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import {HermeneutSharedModule, JhiLanguageHelper} from '../shared';
import {HTTP_INTERCEPTORS} from '../../../../../node_modules/@angular/common/http';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from '../../../../../node_modules/ngx-webstorage';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {JhiEventManager} from '../../../../../node_modules/ng-jhipster';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import {JhiLanguageService} from 'ng-jhipster';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        RiskManagementRoutingModule,
        NgbCollapseModule.forRoot()
    ],
    declarations: [RiskManagementComponent, RiskEvaluationComponent, RiskMitigationComponent],
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
        },
        RiskManagementService
    ]
})
export class RiskManagementModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language
            .subscribe((languageKey: string) => {
                this.languageService.changeLanguage(languageKey)
            });
    }
}
