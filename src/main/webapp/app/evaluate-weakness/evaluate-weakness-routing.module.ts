import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EvaluateWeaknessComponent} from './evaluate-weakness.component';
import {CommonModule} from '@angular/common';

const routes: Routes = [
    {path: '', component: EvaluateWeaknessComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class EvaluateWeaknessRoutingModule {
}
