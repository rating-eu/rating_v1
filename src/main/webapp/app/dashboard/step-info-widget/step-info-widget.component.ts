import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, DashboardStatus, Status } from '../dashboard.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-step-info-widget',
  templateUrl: './step-info-widget.component.html',
  styleUrls: ['step-info-widget.component.css']
})
export class StepInfoWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = false;

  public assetClusteringStatus: string;
  public identifyThreatAgentsStatus: string;
  public assessVulnerablitiesStatus: string;
  public impactEvaluationStatus: string;
  public riskEvaluationStatus: string;
  public alertMessage: string;

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
      this.assetClusteringStatus = status.assetClusteringStatus ? status.assetClusteringStatus.toString() : Status.EMPTY.toString();
      this.identifyThreatAgentsStatus = status.identifyThreatAgentsStatus ? status.identifyThreatAgentsStatus.toString() : Status.EMPTY.toString();
      this.assessVulnerablitiesStatus = status.assessVulnerablitiesStatus ? status.assessVulnerablitiesStatus.toString() : Status.EMPTY.toString();
      this.impactEvaluationStatus = status.impactEvaluationStatus ? status.impactEvaluationStatus.toString() : Status.EMPTY.toString();
      this.riskEvaluationStatus = status.riskEvaluationStatus ? status.riskEvaluationStatus.toString() : Status.EMPTY.toString();
    }
  }

  open(content, link, message?) {
    this.linkAfterModal = link;
    if (message) {
      this.alertMessage = message;
    } else {
      this.alertMessage = null;
    }
    this.modalService.open(content, {}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (this.linkAfterModal) {
        this.router.navigate([this.linkAfterModal]);
      } else {
        console.log('WORK IN PROGRESS');
      }
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
      return `with: ${reason}`;
    }
  }
}
