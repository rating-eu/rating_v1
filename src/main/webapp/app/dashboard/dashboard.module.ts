import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartsModule} from 'ng2-charts';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {EntryPointComponent} from './entry-point/entry-point.component';
import {VulnerabilityRadarWidgetComponent} from './vulnerability-radar-widget/vulnerability-radar-widget.component';
import {NgbCollapseModule} from "@ng-bootstrap/ng-bootstrap";
import { StepStatusWidgetComponent } from './step-status-widget/step-status-widget.component';
import {DashboardService} from "./dashboard.service";
import {HermeneutSharedModule} from "../shared";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "../blocks/interceptor/auth.interceptor";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {AuthExpiredInterceptor} from "../blocks/interceptor/auth-expired.interceptor";
import {ErrorHandlerInterceptor} from "../blocks/interceptor/errorhandler.interceptor";
import {JhiEventManager} from "ng-jhipster";
import {NotificationInterceptor} from "../blocks/interceptor/notification.interceptor";

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        DashboardRoutingModule,
        ChartsModule,
        NgbCollapseModule.forRoot()
    ],
    declarations: [EntryPointComponent, VulnerabilityRadarWidgetComponent, StepStatusWidgetComponent],
    providers:[
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
