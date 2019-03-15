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

import {PanelMenuModule} from 'primeng/panelmenu';
// jhipster-needle-angular-add-module-import JHipster will add new module here

import {
    JhiMainComponent,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ActiveMenuDirective,
    ErrorComponent,
    SidebarComponent
} from './layouts';
import {QuestionnairesService} from './questionnaires/questionnaires.service';
import {ReactiveFormsModule} from '@angular/forms';
import {DatasharingModule} from './datasharing/datasharing.module';
import {MaterialModule} from './material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MainService } from './layouts/main/main.service';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        Ng2Webstorage.forRoot({prefix: 'jhi', separator: '-'}),
        HermeneutSharedModule.forRoot(),
        HermeneutHomeModule,
        HermeneutAdminModule,
        HermeneutAccountModule,
        HermeneutEntityModule,
        HermeneutAppRoutingModule,
        DatasharingModule.forRoot(),
        BrowserAnimationsModule,
        MaterialModule,
        PanelMenuModule
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    exports: [
        MaterialModule,
        PanelMenuModule
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FooterComponent,
        SidebarComponent
    ],
    providers: [
        ProfileService,
        PaginationConfig,
        UserRouteAccessService,
        QuestionnairesService,
        MainService,
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
