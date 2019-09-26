import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PrivacyBoardRoutingModule} from './privacy-board-routing.module';
import {PrivacyBoardComponent} from './privacy-board/privacy-board.component';
import {DataSharingModule} from "../data-sharing/data-sharing.module";

@NgModule({
    imports: [
        CommonModule,
        DataSharingModule,
        PrivacyBoardRoutingModule
    ],
    declarations: [PrivacyBoardComponent]
})
export class PrivacyBoardModule {
}
