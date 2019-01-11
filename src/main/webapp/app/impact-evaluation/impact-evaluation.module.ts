import { IdentifyAssetUtilService } from './../identify-assets/identify-asset.util.service';
import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImpactEvaluationRoutingModule } from './impact-evaluation-routing.module';
import { ImpactEvaluationComponent } from './impact-evaluation/impact-evaluation.component';
import { ImpactEvaluationService } from './impact-evaluation.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HermeneutSharedModule, JhiLanguageHelper} from '../shared';
import { HTTP_INTERCEPTORS } from '../../../../../node_modules/@angular/common/http';
import { AuthInterceptor } from '../blocks/interceptor/auth.interceptor';
import { LocalStorageService, SessionStorageService } from '../../../../../node_modules/ngx-webstorage';
import { AuthExpiredInterceptor } from '../blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from '../blocks/interceptor/errorhandler.interceptor';
import { JhiEventManager } from '../../../../../node_modules/ng-jhipster';
import { NotificationInterceptor } from '../blocks/interceptor/notification.interceptor';
import {JhiLanguageService} from 'ng-jhipster';
import { MyCompanyMgmService } from '../entities/my-company-mgm';
import { AttackRelatedCostsEstimationComponent } from './attack-related-costs-estimation/attack-related-costs-estimation.component';

@NgModule({
  imports: [
    HermeneutSharedModule,
    CommonModule,
    ImpactEvaluationRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    ImpactEvaluationComponent,
    AttackRelatedCostsEstimationComponent
  ],
  exports: [
    ImpactEvaluationComponent
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
    ImpactEvaluationService,
    MyCompanyMgmService,
    IdentifyAssetUtilService
  ]
})
export class ImpactEvaluationModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language
            .subscribe((languageKey: string) => {
                this.languageService.changeLanguage(languageKey);
            });
    }
}
