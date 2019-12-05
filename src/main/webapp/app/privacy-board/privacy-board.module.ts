import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PrivacyBoardRoutingModule} from './privacy-board-routing.module';
import {PrivacyBoardComponent} from './privacy-board/privacy-board.component';
import {DataSharingModule} from '../data-sharing/data-sharing.module';
import {PrivacyStepsStatusWidgetComponent} from './privacy-steps-status-widget/privacy-steps-status-widget.component';
import {PrivacyBoardService} from './privacy-board.service';
import {MaterialModule} from '../material/material.module';
import {HermeneutSharedModule} from '../shared';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {JhiEventManager} from 'ng-jhipster';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import {PrivacyRiskAssessmentModule} from '../privacy-risk-assessment/privacy-risk-assessment.module';
import {SecurityImpactsWidgetComponent} from './security-impacts-widget/security-impacts-widget.component';
import {ChartsModule} from "ng2-charts";
import {DataThreatsWidgetComponent} from './data-threats-widget/data-threats-widget.component';
import {DataRisksWidgetComponent} from './data-risks-widget/data-risks-widget.component';
import {OverallSecurityImpactWidgetComponent} from './overall-security-impact-widget/overall-security-impact-widget.component';
import {OverallDataThreatWidgetComponent} from './overall-data-threat-widget/overall-data-threat-widget.component';
import {OverallDataRiskWidgetComponent} from './overall-data-risk-widget/overall-data-risk-widget.component';
import {OverallDataRiskWidgetService} from "./overall-data-risk-widget/overall-data-risk-widget.service";
import { RiskConfigComponent } from './risk-config/risk-config.component';
import { OperationContextWidgetComponent } from './operation-context-widget/operation-context-widget.component';

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        DataSharingModule,
        MaterialModule,
        ChartsModule,
        PrivacyBoardRoutingModule,
        PrivacyRiskAssessmentModule
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
        PrivacyBoardService,
        OverallDataRiskWidgetService
    ],
    declarations: [PrivacyBoardComponent, PrivacyStepsStatusWidgetComponent, SecurityImpactsWidgetComponent, DataThreatsWidgetComponent, DataRisksWidgetComponent, OverallSecurityImpactWidgetComponent, OverallDataThreatWidgetComponent, OverallDataRiskWidgetComponent, RiskConfigComponent, OperationContextWidgetComponent]
})
export class PrivacyBoardModule {
}