import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserRouteAccessService} from "../shared";
import {ExternalAuditorComponent} from "./external-auditor/external-auditor.component";
import {FinancialDeputyComponent} from "./financial-deputy/financial-deputy.component";
import {CisoComponent} from "./ciso/ciso.component";
import {EmployeeComponent} from "./employee/employee.component";

const routes: Routes = [
    {
        path: '',
        data: {
            authorities: ['ROLE_CISO'],
        },
        canActivate: [UserRouteAccessService],
        children: [
            {
                path: 'employee/:role',
                component: EmployeeComponent
            },
            {
                path: 'employee/:role/:id',
                component: EmployeeComponent
            },
            {
                path: 'ciso',
                component: CisoComponent
            },
            {
                path: 'external',
                component: ExternalAuditorComponent,
            },
            {
                path: 'financial',
                component: FinancialDeputyComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeesRoutingModule {
}
