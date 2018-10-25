import {NgModule, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {CompanyWidgetComponent} from './company-widget/company-widget.component';
import {AssetWidgetComponent} from './asset-widget/asset-widget.component';
import {ThreatAgentsWidgetComponent} from './threat-agents-widget/threat-agents-widget.component';
import {AttackStrategiesWidgetComponent} from './attack-strategies-widget/attack-strategies-widget.component';
import {MostDangerousAssetsWidgetComponent} from './most-dangerous-assets-widget/most-dangerous-assets-widget.component';
import {OverallLikelihoodWidgetComponent} from './overall-likelihood-widget/overall-likelihood-widget.component';
import {MostDangerousThreatAgentsWidgetComponent} from './most-dangerous-threat-agents-widget/most-dangerous-threat-agents-widget.component';
import {AttackMapWidgetComponent} from './attack-map-widget/attack-map-widget.component';
import {FinancialDataWidgetComponent} from './financial-data-widget/financial-data-widget.component';
import {SplittingWidgetComponent} from './splitting-widget/splitting-widget.component';
import {DashboardOneComponent} from './dashboard-one/dashboard-one.component';
import {HermeneutSharedModule, JhiLanguageHelper} from '../shared';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {JhiEventManager, JhiLanguageService} from 'ng-jhipster';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import {DashboardUtilsService} from './dashboard-utils.service';
import {DashboardService} from './dashboard.service';
import { IdentifyAssetUtilService } from '../identify-assets/identify-asset.util.service';
import { RiskManagementService } from '../risk-management/risk-management.service';

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        DashboardRoutingModule
    ],
    declarations: [
        CompanyWidgetComponent,
        AssetWidgetComponent,
        ThreatAgentsWidgetComponent,
        AttackStrategiesWidgetComponent,
        MostDangerousAssetsWidgetComponent,
        OverallLikelihoodWidgetComponent,
        MostDangerousThreatAgentsWidgetComponent,
        AttackMapWidgetComponent,
        FinancialDataWidgetComponent,
        SplittingWidgetComponent,
        DashboardOneComponent
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
        DashboardUtilsService,
        DashboardService,
        IdentifyAssetUtilService,
        RiskManagementService
    ]
})
export class DashboardModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language
            .subscribe((languageKey: string) => {
                this.languageService.changeLanguage(languageKey);
            });
    }
}
