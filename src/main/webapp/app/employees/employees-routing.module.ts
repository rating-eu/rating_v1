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
                component: EmployeeComponent,
                data: {
                    pageTitle: 'employees.employee.page.title'
                }
            },
            {
                path: 'employee/:role/:id',
                component: EmployeeComponent,
                data: {
                    pageTitle: 'employees.employee.page.title'
                }
            },
            {
                path: 'ciso',
                component: CisoComponent,
                data: {
                    pageTitle: 'employees.ciso.page.title'
                }
            },
            {
                path: 'external',
                component: ExternalAuditorComponent,
                data: {
                    pageTitle: 'employees.external.page.title'
                }
            },
            {
                path: 'financial',
                component: FinancialDeputyComponent,
                data: {
                    pageTitle: 'employees.financial.page.title'
                }
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
