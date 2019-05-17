import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartsModule} from 'ng2-charts';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {EntryPointComponent} from './entry-point/entry-point.component';
import {VulnerabilityRadarWidgetComponent} from './vulnerability-radar-widget/vulnerability-radar-widget.component';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import {StepStatusWidgetComponent} from './step-status-widget/step-status-widget.component';
import {DashboardService} from './dashboard.service';
import {HermeneutSharedModule} from '../shared';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {JhiEventManager} from 'ng-jhipster';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import {MostDangerousThreatAgentsWidgetComponent} from './most-dangerous-threat-agents-widget/most-dangerous-threat-agents-widget.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {ResultsModule} from '../results/results.module';
import {OverallLikelihoodWidgetComponent} from './overall-likelihood-widget/overall-likelihood-widget.component';
import {CompanyWidgetComponent} from './company-widget/company-widget.component';
import {ThreatAgentsWidgetComponent} from './threat-agents-widget/threat-agents-widget.component';
import {CustomersWidgetComponent} from './customers-widget/customers-widget.component';
import {AttackStrategiesWidgetComponent} from "./attack-strategies-widget/attack-strategies-widget.component";
import {ImpactEvaluationModule} from "../impact-evaluation/impact-evaluation.module";
import {RiskManagementModule} from "../risk-management/risk-management.module";

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        DashboardRoutingModule,
        ChartsModule,
        NgxPaginationModule,
        ResultsModule,
        ImpactEvaluationModule,
        RiskManagementModule,
        NgbCollapseModule.forRoot()
    ],
    declarations: [
        EntryPointComponent,
        StepStatusWidgetComponent,
        CompanyWidgetComponent,
        VulnerabilityRadarWidgetComponent,
        ThreatAgentsWidgetComponent,
        AttackStrategiesWidgetComponent,
        CustomersWidgetComponent,
        MostDangerousThreatAgentsWidgetComponent,
        OverallLikelihoodWidgetComponent
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
        DashboardService
    ]
})
export class DashboardModule {
}
