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

import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MySelfAssessmentsRoutingModule } from './my-self-assessments-routing.module';
import { MySelfAssessmentsComponent } from './my-self-assessments.component';
import { FormsModule } from '../../../../../node_modules/@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../blocks/interceptor/auth.interceptor';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { AuthExpiredInterceptor } from '../blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from '../blocks/interceptor/errorhandler.interceptor';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { NotificationInterceptor } from '../blocks/interceptor/notification.interceptor';
import { JhiLanguageHelper, HermeneutSharedModule } from '../shared';
import { HermeneutSelfAssessmentMgmModule } from '../entities/self-assessment-mgm/self-assessment-mgm.module';

@NgModule({
  imports: [
    HermeneutSharedModule,
    CommonModule,
    MySelfAssessmentsRoutingModule,
    FormsModule
  ],
  declarations: [MySelfAssessmentsComponent],
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
export class MySelfAssessmentsModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language
        .subscribe((languageKey: string) => {
            this.languageService.changeLanguage(languageKey);
        });
}
}
