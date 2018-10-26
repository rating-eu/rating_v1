import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-most-dangerous-threat-agents-widget',
  templateUrl: './most-dangerous-threat-agents-widget.component.html',
  styleUrls: ['most-dangerous-threat-agents-widget.component.css']
})
export class MostDangerousThreatAgentsWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

}
