import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, DashboardStatus } from '../dashboard.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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

  private closeResult: string;
  private linkAfterModal: string;

  constructor(
    private dashService: DashboardService,
    private modalService: NgbModal,
    private router: Router
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
      this.riskEvaluationStatus = status.riskEvaluationStatus;
    }
  }

  open(content, link) {
    this.linkAfterModal = link;
    this.modalService.open(content, {}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.router.navigate([this.linkAfterModal]);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
