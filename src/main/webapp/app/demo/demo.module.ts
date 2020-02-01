import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DemoRoutingModule} from './demo-routing.module';
import {DemoComponent} from './demo/demo.component';
import {DemoService} from "./demo.service";
import {DashboardModule} from "../dashboard/dashboard.module";

@NgModule({
    imports: [
        CommonModule,
        DemoRoutingModule,
        DashboardModule
    ],
    declarations: [DemoComponent],
    providers: [
        DemoService
    ]
})
export class DemoModule {
}
