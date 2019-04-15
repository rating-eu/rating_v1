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
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        ResultsRoutingModule,
        NgxPaginationModule,
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
