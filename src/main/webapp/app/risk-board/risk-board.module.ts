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

import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RiskBoardRoutingModule} from './risk-board-routing.module';
import {AssetWidgetComponent} from './asset-widget/asset-widget.component';
import {TangibleFinancialWidgetComponent} from './tangible-financial-widget/tangible-financial-widget.component';
import {LossesWidgetComponent} from './losses-widget/losses-widget.component';
import {DashboardOneComponent} from './dashboard-one/dashboard-one.component';
import {HermeneutSharedModule, JhiLanguageHelper} from '../shared';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {JhiEventManager, JhiLanguageService} from 'ng-jhipster';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import {RiskBoardUtilsService} from './risk-board-utils.service';
import {RiskBoardService} from './risk-board.service';
import {IdentifyAssetUtilService} from '../identify-assets/identify-asset.util.service';
import {RiskManagementService} from '../risk-management/risk-management.service';
import {MaterialModule} from '../material/material.module';
import {AttackMapService} from '../evaluate-weakness/attack-map.service';
import {SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {LevelMgmService} from '../entities/level-mgm';
import {PhaseMgmService} from '../entities/phase-mgm';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import {ResultsService} from '../results/results.service';
import {ChartsModule} from 'ng2-charts';
import {ImpactEvaluationService} from '../impact-evaluation/impact-evaluation.service';
import {PopUpService} from '../shared/pop-up-services/pop-up.service';
import {StepInfoWidgetComponent} from './step-info-widget/step-info-widget.component';
import {HermeneutAttackStrategyMgmModule} from '../entities/attack-strategy-mgm/attack-strategy-mgm.module';
import {AssetAtRiskWidgetComponent} from './asset-at-risk-widget/asset-at-risk-widget.component';
import {EbitsWidgetComponent} from './ebits-widget/ebits-widget.component';
import {IntangibleFinancialWidgetComponent} from './intangible-financial-widget/intangible-financial-widget.component';
import {ImpactWidgetComponent} from './impact-widget/impact-widget.component';
import {FinancialValueWidgetComponent} from './financial-value-widget/financial-value-widget.component';
import {RiskSquareWidgetComponent} from './risk-square-widget/risk-square-widget.component';
import {MostVulnerableAssetsWidgetComponent} from './most-vulnerable-assets-widget/most-vulnerable-assets-widget.component';
import {MostCriticalAttackStrategiesWidgetComponent} from './most-critical-attack-strategies-widget/most-critical-attack-strategies-widget.component';
import {CriticalAttackStrategyService} from './models/critical-attack-strategy.service';

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        RiskBoardRoutingModule,
        MaterialModule,
        NgxPaginationModule,
        NgbCollapseModule.forRoot(),
        ChartsModule,
        HermeneutAttackStrategyMgmModule
    ],
    declarations: [
        AssetWidgetComponent,
        MostVulnerableAssetsWidgetComponent,
        TangibleFinancialWidgetComponent,
        LossesWidgetComponent,
        DashboardOneComponent,
        StepInfoWidgetComponent,
        AssetAtRiskWidgetComponent,
        EbitsWidgetComponent,
        IntangibleFinancialWidgetComponent,
        ImpactWidgetComponent,
        FinancialValueWidgetComponent,
        RiskSquareWidgetComponent,
        MostCriticalAttackStrategiesWidgetComponent
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
        RiskBoardUtilsService,
        RiskBoardService,
        IdentifyAssetUtilService,
        RiskManagementService,
        AttackMapService,
        SelfAssessmentMgmService,
        LevelMgmService,
        PhaseMgmService,
        ResultsService,
        ImpactEvaluationService,
        PopUpService,
        RiskManagementService,
        CriticalAttackStrategyService
    ]
})
export class RiskBoardModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language
            .subscribe((languageKey: string) => {
                this.languageService.changeLanguage(languageKey);
            });
    }
}
