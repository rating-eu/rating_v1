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

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        EvaluateWeaknessRoutingModule,
        DatasharingModule
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
                this.languageService.changeLanguage(languageKey)
            });
    }
}
