import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PeopleRoutingModule} from './people-routing.module';
import {ExternalAuditorComponent} from './external-auditor/external-auditor.component';
import {FinancialDeputyComponent} from './financial-deputy/financial-deputy.component';
import {PeopleComponent} from './people/people.component';
import {CisoComponent} from './ciso/ciso.component';
import {MaterialModule} from "../material/material.module";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        CommonModule,
        PeopleRoutingModule,
        MaterialModule
    ],
    declarations: [ExternalAuditorComponent, FinancialDeputyComponent, PeopleComponent, CisoComponent]
})
export class PeopleModule {
}
