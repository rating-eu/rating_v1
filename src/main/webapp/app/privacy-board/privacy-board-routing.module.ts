import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PrivacyBoardComponent} from './privacy-board/privacy-board.component';
import {RiskConfigComponent} from "./risk-config/risk-config.component";

const routes: Routes = [
    {
        path: '',
        component: PrivacyBoardComponent,
        data: {
            pageTitle: 'gdpr.privacy-board.page.title'
        }
    },
    {
        path: 'risk-config',
        component: RiskConfigComponent,
        data: {
            pageTitle: 'gdpr.risk-config.page.title'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivacyBoardRoutingModule {
}
