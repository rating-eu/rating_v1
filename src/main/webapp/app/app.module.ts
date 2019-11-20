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
import { RatingModule } from 'ngx-bootstrap/rating';

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
import {DataSharingModule} from './data-sharing/data-sharing.module';
import {MaterialModule} from './material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MainService} from './layouts/main/main.service';
import {DtoModule} from "./dto/dto.module";

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
        DtoModule,
        HermeneutAppRoutingModule,
        DataSharingModule.forRoot(),
        BrowserAnimationsModule,
        MaterialModule,
        PanelMenuModule,
        RatingModule
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
