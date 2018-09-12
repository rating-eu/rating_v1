import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MyCompanyRoutingModule} from './my-company-routing.module';
import {MyCompanyComponent} from './my-company/my-company.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MyCompanyRoutingModule
    ],
    declarations: [MyCompanyComponent]
})
export class MyCompanyModule {
}
