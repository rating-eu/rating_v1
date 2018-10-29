import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStatus } from '../dashboard.service';

@Component({
  selector: 'jhi-step-info-widget',
  templateUrl: './step-info-widget.component.html',
  styleUrls: ['step-info-widget.component.css']
})
export class StepInfoWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = false;

  public assetClusteringStatus = false;
  public identifyThreatAgentsStatus = false;
  public assessVulnerablitiesStatus = false;
  public impactEvaluationStatus = false;
  public riskEvaluationStatus = false;

  constructor(
    private dashService: DashboardService
  ) { }

  ngOnInit() {
    const status: DashboardStatus = this.dashService.getStatus();
    this.updateStatus(status);
    this.dashService.observeStatus().subscribe((receivedStatus: DashboardStatus) => {
      if (receivedStatus) {
        this.updateStatus(receivedStatus);
      }
    });
  }

  private updateStatus(status: DashboardStatus) {
    if (status) {
      this.assetClusteringStatus = status.assetClusteringStatus;
      this.identifyThreatAgentsStatus = status.identifyThreatAgentsStatus;
      this.assessVulnerablitiesStatus = status.assessVulnerablitiesStatus;
      this.impactEvaluationStatus = status.impactEvaluationStatus;
      this.riskEvaluationStatus = status.impactEvaluationStatus;
    }
  }

}
