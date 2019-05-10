import { Component, OnInit } from '@angular/core';
import {Status} from "../../risk-board/risk-board.service";

@Component({
  selector: 'jhi-step-status-widget',
  templateUrl: './step-status-widget.component.html',
  styles: []
})
export class StepStatusWidgetComponent implements OnInit {
    identifyThreatAgentsStatus: Status;

  constructor() { }

  ngOnInit() {
  }

}
