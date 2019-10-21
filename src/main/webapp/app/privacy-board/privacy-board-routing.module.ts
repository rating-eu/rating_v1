import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PrivacyBoardComponent} from './privacy-board/privacy-board.component';

const routes: Routes = [
    {
        path: '',
        component: PrivacyBoardComponent,
        data: {
            pageTitle: 'gdpr.privacy-board.page.title'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivacyBoardRoutingModule {
}
