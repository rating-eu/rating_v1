import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PrivacyBoardComponent} from './privacy-board/privacy-board.component';
import {DataOperationContextComponent} from '../privacy-risk-assessment/data-operation-context/data-operation-context.component';

const routes: Routes = [
    {
        path: '',
        component: PrivacyBoardComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrivacyBoardRoutingModule {
}
