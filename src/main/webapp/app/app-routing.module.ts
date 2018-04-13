import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {errorRoute, navbarRoute} from './layouts';
import {DEBUG_INFO_ENABLED} from './app.constants';

const routes: Routes = [
    navbarRoute,
    ...errorRoute,
    {
        path: 'questionnaires-id-ta',
        loadChildren: './questionnaires/questionnaires.module#QuestionnairesModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {useHash: true, enableTracing: DEBUG_INFO_ENABLED})
    ],
    exports: [
        RouterModule
    ]
})
export class HermeneutAppRoutingModule {
}
