import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyBoardRoutingModule } from './privacy-board-routing.module';
import { PrivacyBoardComponent } from './privacy-board/privacy-board.component';

@NgModule({
  imports: [
    CommonModule,
    PrivacyBoardRoutingModule
  ],
  declarations: [PrivacyBoardComponent]
})
export class PrivacyBoardModule { }
