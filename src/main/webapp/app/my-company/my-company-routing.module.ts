import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MyCompanyComponent} from './my-company/my-company.component';

const routes: Routes = [
    {
        path: '',
        component: MyCompanyComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MyCompanyRoutingModule {
}
