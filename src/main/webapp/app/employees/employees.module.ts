import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EmployeesRoutingModule} from './employees-routing.module';
import {ExternalAuditorComponent} from './external-auditor/external-auditor.component';
import {FinancialDeputyComponent} from './financial-deputy/financial-deputy.component';
import {CisoComponent} from './ciso/ciso.component';
import {MaterialModule} from '../material/material.module';
import {FormsModule} from '@angular/forms';
import {DatasharingModule} from '../datasharing/datasharing.module';
import {EmployeeComponent} from './employee/employee.component';
import {HermeneutSharedModule} from '../shared';
import {EmployeeService} from './employee.service';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "../blocks/interceptor/auth.interceptor";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {AuthExpiredInterceptor} from "../blocks/interceptor/auth-expired.interceptor";
import {ErrorHandlerInterceptor} from "../blocks/interceptor/errorhandler.interceptor";
import {JhiEventManager} from "ng-jhipster";
import {NotificationInterceptor} from "../blocks/interceptor/notification.interceptor";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        EmployeesRoutingModule,
        DatasharingModule,
        MaterialModule,
        FormsModule,
        RouterModule
    ],
    declarations: [
        CisoComponent,
        ExternalAuditorComponent,
        FinancialDeputyComponent,
        EmployeeComponent
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
        EmployeeService
    ]
})
export class EmployeesModule {
}
