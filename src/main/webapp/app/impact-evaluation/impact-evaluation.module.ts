/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {IdentifyAssetUtilService} from './../identify-assets/identify-asset.util.service';
import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ImpactEvaluationRoutingModule} from './impact-evaluation-routing.module';
import {ImpactEvaluationComponent} from './quantitative/impact-evaluation/impact-evaluation.component';
import {ImpactEvaluationService} from './impact-evaluation.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HermeneutSharedModule, JhiLanguageHelper} from '../shared';
import {HTTP_INTERCEPTORS} from '../../../../../node_modules/@angular/common/http';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from '../../../../../node_modules/ngx-webstorage';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {JhiEventManager} from '../../../../../node_modules/ng-jhipster';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import {JhiLanguageService} from 'ng-jhipster';
import {MyCompanyMgmService} from '../entities/my-company-mgm';
import {AttackRelatedCostsEstimationComponent} from './quantitative/attack-related-costs-estimation/attack-related-costs-estimation.component';
import {DataAssetsLossesEstimationComponent} from './quantitative/data-assets-losses-estimation/data-assets-losses-estimation.component';
import {GrowthRatesConfiguratorComponentComponent} from './quantitative/growth-rates-configurator-component/growth-rates-configurator-component.component';
import {ChoiceComponent} from './choice/choice.component';
import {MaterialModule} from '../material/material.module';
import {QualitativeComponent} from './qualitative/qualitative.component';
import {AssetsImpactComponent} from './qualitative/assets-impact/assets-impact.component';
import {DatasharingModule} from "../datasharing/datasharing.module";

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        ImpactEvaluationRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        DatasharingModule
    ],
    declarations: [
        ImpactEvaluationComponent,
        AttackRelatedCostsEstimationComponent,
        DataAssetsLossesEstimationComponent,
        GrowthRatesConfiguratorComponentComponent,
        ChoiceComponent,
        QualitativeComponent,
        AssetsImpactComponent
    ],
    exports: [
        ImpactEvaluationComponent
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
        ImpactEvaluationService,
        MyCompanyMgmService,
        IdentifyAssetUtilService
    ]
})
export class ImpactEvaluationModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language
            .subscribe((languageKey: string) => {
                this.languageService.changeLanguage(languageKey);
            });
    }
}
