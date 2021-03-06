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
import {IdentifyAssetsRoutingModule} from './identify-assets-routing.module';
import {IdentifyAssetUtilService} from './identify-asset.util.service';
import {HermeneutSharedModule, JhiLanguageHelper} from '../shared';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {JhiEventManager, JhiLanguageService} from 'ng-jhipster';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import { IdentifyAssetService } from './identify-asset.service';
import { AssetClusteringComponent } from './asset-clustering/asset-clustering.component';
import { CascadeEffectsComponent } from './cascade-effects/cascade-effects.component';
import { AssetReportComponent } from './asset-report/asset-report.component';
import { AttackCostsComponent } from './attack-costs/attack-costs.component';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        IdentifyAssetsRoutingModule
    ],
    declarations: [
        AssetClusteringComponent,
        CascadeEffectsComponent,
        AssetReportComponent,
        AttackCostsComponent
    ],
    exports: [
        AssetClusteringComponent,
        CascadeEffectsComponent,
        AssetReportComponent,
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
        IdentifyAssetUtilService,
        IdentifyAssetService
    ]
})
export class IdentifyAssetModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language
            .subscribe((languageKey: string) => {
                this.languageService.changeLanguage(languageKey);
            });
    }
}
