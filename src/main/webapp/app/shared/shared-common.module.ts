import {NgModule} from '@angular/core';

import {
    HermeneutSharedLibsModule,
    JhiAlertComponent,
    JhiAlertErrorComponent,
} from './';

@NgModule({
    imports: [
        HermeneutSharedLibsModule
    ],
    declarations: [
        JhiAlertComponent,
        JhiAlertErrorComponent
    ],
    exports: [
        HermeneutSharedLibsModule,
        JhiAlertComponent,
        JhiAlertErrorComponent
    ]
})
export class HermeneutSharedCommonModule {
}
