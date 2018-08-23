import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IdentifyAssetsRoutingModule} from './identify-assets-routing.module';
import {IdentifyAssetComponent} from './id-assets/identify-asset.component';
import {QuestionComponent} from './question-component/question.component';
import {IdentifyAssetUtilService} from './identify-asset.util.service';
import {HermeneutSharedModule} from '../shared';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthExpiredInterceptor} from '../blocks/interceptor/auth-expired.interceptor';
import {AuthInterceptor} from '../blocks/interceptor/auth.interceptor';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {ErrorHandlerInterceptor} from '../blocks/interceptor/errorhandler.interceptor';
import {JhiEventManager} from 'ng-jhipster';
import {NotificationInterceptor} from '../blocks/interceptor/notification.interceptor';

@NgModule({
    imports: [
        HermeneutSharedModule,
        CommonModule,
        IdentifyAssetsRoutingModule

    ],
    declarations: [
        IdentifyAssetComponent,
        QuestionComponent
    ],
    exports: [
        IdentifyAssetComponent,
        QuestionComponent
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
        IdentifyAssetUtilService
    ]
})
export class IdentifyAssetModule {
}
