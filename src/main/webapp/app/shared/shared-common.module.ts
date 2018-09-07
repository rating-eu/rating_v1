import {NgModule} from '@angular/core';

import {
    HermeneutSharedLibsModule,
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    LoginPlainComponent
} from './';

@NgModule({
    imports: [
        HermeneutSharedLibsModule
    ],
    declarations: [
        JhiAlertComponent,
        JhiAlertErrorComponent,
        LoginPlainComponent
    ],
    exports: [
        HermeneutSharedLibsModule,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        LoginPlainComponent
    ]
})
export class HermeneutSharedCommonModule {
}
