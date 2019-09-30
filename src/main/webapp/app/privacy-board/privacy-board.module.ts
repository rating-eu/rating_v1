import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PrivacyBoardRoutingModule} from './privacy-board-routing.module';
import {PrivacyBoardComponent} from './privacy-board/privacy-board.component';
import {DataSharingModule} from '../data-sharing/data-sharing.module';
import {PrivacyStepsStatusWidgetComponent} from './privacy-steps-status-widget/privacy-steps-status-widget.component';
import {PrivacyBoardService} from './privacy-board.service';
import {MaterialModule} from '../material/material.module';
import {HermeneutSharedModule} from '../shared';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {JhiEventManager} from 'ng-jhipster';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import {PrivacyRiskAssessmentModule} from '../privacy-risk-assessment/privacy-risk-assessment.module';

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        DataSharingModule,
        MaterialModule,
        PrivacyBoardRoutingModule,
        PrivacyRiskAssessmentModule
    ],
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
        PrivacyBoardService
    ],
    declarations: [PrivacyBoardComponent, PrivacyStepsStatusWidgetComponent]
})
export class PrivacyBoardModule {
}
