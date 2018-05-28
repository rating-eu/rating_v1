import {NgModule} from '@angular/core';
import {HermeneutSharedModule} from '../shared';
import {EvaluateWeaknessComponent} from './evaluate-weakness.component';
import {CommonModule} from '@angular/common';
import {EvaluateWeaknessRoutingModule} from './evaluate-weakness-routing.module';

@NgModule({
    imports: [
        CommonModule,
        HermeneutSharedModule,
        EvaluateWeaknessRoutingModule
    ],
    declarations: [
        EvaluateWeaknessComponent
    ],
    entryComponents: [],
    providers: []
})
export class EvaluateWeaknessModule {
}
