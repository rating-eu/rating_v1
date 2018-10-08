import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ResultsRoutingModule} from './results-routing.module';
import {ResultsOverviewComponent} from './results-overview/results-overview.component';
import {ResultsService} from './results.service';
import {MaterialModule} from '../material/material.module';
import {HermeneutSharedModule} from '../shared';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {JhiEventManager} from 'ng-jhipster';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        ResultsRoutingModule,
        MaterialModule
    ],
    declarations: [ResultsOverviewComponent],
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
        ResultsService]
})
export class ResultsModule {
}
