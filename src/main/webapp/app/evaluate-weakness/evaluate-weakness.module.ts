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
import {HermeneutSharedModule, JhiLanguageHelper} from '../shared';
import {EvaluateWeaknessComponent} from './evaluate-weakness.component';
import {CommonModule} from '@angular/common';
import {EvaluateWeaknessRoutingModule} from './evaluate-weakness-routing.module';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {IdentifyThreatAgentService} from '../identify-threat-agent/identify-threat-agent.service';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import {JhiEventManager, JhiLanguageService} from 'ng-jhipster';
import {DatasharingModule} from '../datasharing/datasharing.module';
import {WeaknessResultComponent} from './result/result.component';
import {EvaluateService} from './evaluate-weakness.service';
import {AttackMapService} from './attack-map.service';
import {MaterialModule} from '../material/material.module';
import { HermeneutAttackStrategyMgmModule } from '../entities/attack-strategy-mgm/attack-strategy-mgm.module';

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        EvaluateWeaknessRoutingModule,
        DatasharingModule,
        MaterialModule,
        HermeneutAttackStrategyMgmModule
    ],
    declarations: [
        EvaluateWeaknessComponent,
        WeaknessResultComponent
    ],
    exports: [
        WeaknessResultComponent
    ],
    entryComponents: [],
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
        IdentifyThreatAgentService,
        EvaluateService,
        AttackMapService
    ]
})
export class EvaluateWeaknessModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language
            .subscribe((languageKey: string) => {
                this.languageService.changeLanguage(languageKey);
            });
    }
}
