import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {HermeneutSharedModule} from '../shared';

import {HOME_ROUTES, HomeComponent} from './';
import {MaterialModule} from '../material/material.module';
import {AboutUsComponent} from './about.us.component';

@NgModule({
    imports: [
        HermeneutSharedModule,
        RouterModule.forChild(HOME_ROUTES),
        MaterialModule
    ],
    exports: [
        AboutUsComponent
    ],
    declarations: [
        HomeComponent,
        AboutUsComponent
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutHomeModule {
}
