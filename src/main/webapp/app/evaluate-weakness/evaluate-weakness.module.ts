import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HermeneutSharedModule} from '../shared';
import {EvaluateWeaknessComponent} from './evaluate-weakness.component';
import {evaluateWeaknessRoute} from './evaluate-weakness.route';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        RouterModule.forRoot([evaluateWeaknessRoute], {useHash: true})
    ],
    declarations: [
        EvaluateWeaknessComponent
    ],
    entryComponents: [],
    providers: []
})
export class EvaluateWeaknessModule {
}
