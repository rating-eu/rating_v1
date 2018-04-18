import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HermeneutSharedModule} from '../shared';
import {EvaluateWeacknessComponent, evaluateWeacknessRoute} from './';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        RouterModule.forRoot([evaluateWeacknessRoute], {useHash: true})
    ],
    declarations: [
        EvaluateWeacknessComponent
    ],
    entryComponents: [],
    providers: []
})
export class EvaluateWeacknessModule {
}
