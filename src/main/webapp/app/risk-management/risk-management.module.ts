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

import { DashboardService } from './../dashboard/dashboard.service';
import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RiskManagementRoutingModule} from './risk-management-routing.module';
import {RiskManagementComponent} from './risk-management/risk-management.component';
import {RiskManagementService} from './risk-management.service';
import {RiskEvaluationComponent} from './risk-evaluation/risk-evaluation.component';
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
import {NgxPaginationModule} from 'ngx-pagination';
import { HermeneutMitigationMgmModule } from '../entities/mitigation-mgm/mitigation-mgm.module';
import { NgbAccordionModule } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { RiskDetailsComponent } from './risk-details/risk-details.component';
import { ImpactEvaluationService } from '../impact-evaluation/impact-evaluation.service';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        RiskManagementRoutingModule,
        NgxPaginationModule,
        NgbCollapseModule.forRoot(),
        NgbAccordionModule.forRoot(),
        HermeneutMitigationMgmModule
    ],
    declarations: [
        RiskManagementComponent,
        RiskEvaluationComponent,
        RiskDetailsComponent
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
        RiskManagementService,
        DashboardService,
        ImpactEvaluationService
    ]
})
export class RiskManagementModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language
            .subscribe((languageKey: string) => {
                this.languageService.changeLanguage(languageKey);
            });
    }
}
