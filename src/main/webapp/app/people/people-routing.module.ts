import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserRouteAccessService} from "../shared";
import {PeopleComponent} from "./people/people.component";
import {ExternalAuditorComponent} from "./external-auditor/external-auditor.component";
import {FinancialDeputyComponent} from "./financial-deputy/financial-deputy.component";
import {CisoComponent} from "./ciso/ciso.component";

const routes: Routes = [
    {
        path: '',
        component: PeopleComponent,
        data: {
            authorities: ['ROLE_CISO', 'ROLE_EXTERNAL_AUDIT'],
        },
        canActivate: [UserRouteAccessService],
        children: [
            {
                path: 'ciso',
                component: CisoComponent
            },
            {
                path: 'external',
                component: ExternalAuditorComponent
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
export class PeopleRoutingModule {
}
