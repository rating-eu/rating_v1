import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {HermeneutSharedModule} from '../shared';

import {HOME_ROUTE, HomeComponent} from './';
import {MaterialModule} from '../material/material.module';

@NgModule({
    imports: [
        HermeneutSharedModule.forRoot(),
        RouterModule.forChild([HOME_ROUTE]),
        MaterialModule
    ],
    declarations: [
        HomeComponent,
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HermeneutHomeModule {
}
