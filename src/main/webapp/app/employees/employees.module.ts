import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EmployeesRoutingModule} from './employees-routing.module';
import {ExternalAuditorComponent} from './external-auditor/external-auditor.component';
import {FinancialDeputyComponent} from './financial-deputy/financial-deputy.component';
import {CisoComponent} from './ciso/ciso.component';
import {MaterialModule} from '../material/material.module';
import {EmployeesComponent} from './employees/employees.component';

@NgModule({
    imports: [
        CommonModule,
        EmployeesRoutingModule,
        MaterialModule
    ],
    declarations: [ExternalAuditorComponent, FinancialDeputyComponent, EmployeesComponent, CisoComponent]
})
export class EmployeesModule {
}
