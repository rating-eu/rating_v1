import {Injector, NgModule} from '@angular/core';
import {HermeneutSharedModule} from '../shared';

import {CommonModule} from '@angular/common';
import {IdentifyThreatAgentRoutingModule} from './identify-threat-agent-routing.module';
import {IdentifyThreatAgentComponent} from './identify-threat-agent.component';
import {ResultComponent} from './result/result.component';
import {DatasharingModule} from '../datasharing/datasharing.module';
import {IdentifyThreatAgentService} from './identify-threat-agent.service';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {JhiEventManager} from 'ng-jhipster';
import {HermeneutMyAnswerMgmModule} from '../entities/my-answer-mgm/my-answer-mgm.module';

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        IdentifyThreatAgentRoutingModule,
        DatasharingModule,
        HermeneutMyAnswerMgmModule
    ],
    declarations: [
        IdentifyThreatAgentComponent,
        ResultComponent
    ],
    exports: [
        IdentifyThreatAgentComponent,
        ResultComponent
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
        IdentifyThreatAgentService
    ]
})
export class IdentifyThreatAgentModule {
}
