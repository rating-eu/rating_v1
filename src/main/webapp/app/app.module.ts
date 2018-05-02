import './vendor.ts';

import {NgModule, Injector} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Ng2Webstorage, LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {JhiEventManager} from 'ng-jhipster';

import {AuthInterceptor} from './blocks/interceptor/auth.interceptor';
import {AuthExpiredInterceptor} from './blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from './blocks/interceptor/errorhandler.interceptor';
import {NotificationInterceptor} from './blocks/interceptor/notification.interceptor';
import {HermeneutSharedModule, UserRouteAccessService} from './shared';
import {HermeneutAppRoutingModule} from './app-routing.module';
import {HermeneutHomeModule} from './home/home.module';
import {HermeneutAdminModule} from './admin/admin.module';
import {HermeneutAccountModule} from './account/account.module';
import {HermeneutEntityModule} from './entities/entity.module';
import {PaginationConfig} from './blocks/config/uib-pagination.config';
import {IdentifyThreatAgentModule} from './identify-threat-agent/identify-threat-agent.module';
import {EvaluateWeacknessModule} from './evaluate-weackness/evaluate-weackness.module';
import {QuestionnairesModule} from './questionnaires/questionnaires.module';
import {IdentifyAssetModule} from './identify-assets/identify-asset.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here

import {
    JhiMainComponent,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ActiveMenuDirective,
    ErrorComponent
} from './layouts';
import {QuestionnairesService} from './questionnaires/questionnaires.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        Ng2Webstorage.forRoot({prefix: 'jhi', separator: '-'}),
        HermeneutSharedModule,
        HermeneutHomeModule,
        HermeneutAdminModule,
        HermeneutAccountModule,
        HermeneutEntityModule,
        IdentifyThreatAgentModule,
        EvaluateWeacknessModule,
        QuestionnairesModule, // add the feature module here
        HermeneutAppRoutingModule,
        IdentifyAssetModule
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FooterComponent
    ],
    providers: [
        ProfileService,
        PaginationConfig,
        UserRouteAccessService,
        QuestionnairesService,
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
        }
    ],
    bootstrap: [JhiMainComponent]
})
export class HermeneutAppModule {
}
