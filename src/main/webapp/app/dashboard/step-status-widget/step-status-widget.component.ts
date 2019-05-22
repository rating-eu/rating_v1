import {Component, OnInit} from '@angular/core';
import {DashboardService} from "../dashboard.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {DatasharingService} from "../../datasharing/datasharing.service";
import {CompanyBoardStep} from "../../entities/enumerations/CompanyBoardStep.enum";
import {forkJoin} from "rxjs/observable/forkJoin";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {Status} from "../../entities/enumerations/Status.enum";
import {switchMap} from "rxjs/operators";
import {CompletionDtoService} from "../../dto/completion/completion-dto.service";
import {AssessVulnerabilitiesCompletionDTO} from "../../dto/completion/assess-vulnerabilities-completion";
import {of} from "rxjs/observable/of";

@Component({
    selector: 'jhi-step-status-widget',
    templateUrl: './step-status-widget.component.html',
    styles: []
})
export class StepStatusWidgetComponent implements OnInit {

    public isCollapsed = false;
    private myCompany: MyCompanyMgm;
    public statusEnum = Status;

    public identifyThreatAgentsStatus: Status = Status.EMPTY;
    public assessVulnerabilitiesStatus: Status = Status.EMPTY;
    public refineVulnerabilitiesStatus: Status = Status.EMPTY;

    public assessVulnerabilitiesCompletion: AssessVulnerabilitiesCompletionDTO = null;

    private closeResult: string;
    private linkAfterModal: string;
    public alertMessage: string;


    constructor(
        private dataSharingService: DatasharingService,
        private completionDTOService: CompletionDtoService,
        private dashboardService: DashboardService,
        private modalService: NgbModal,
        private router: Router) {
    }

    ngOnInit() {
        this.myCompany = this.dataSharingService.myCompany;
        this.fetchStatus();

        this.dataSharingService.myCompanyObservable.subscribe((response: MyCompanyMgm) => {
            this.myCompany = response;
            this.fetchStatus();
        });
    }

    private fetchStatus() {
        if (this.myCompany && this.myCompany.companyProfile) {
            const identifyThreatAgentStatus$ = this.dashboardService.getStatusFromServer(this.myCompany.companyProfile, CompanyBoardStep.IDENTIFY_THREAT_AGENTS);
            const assessVulnerabilitiesStatus$ = this.dashboardService.getStatusFromServer(this.myCompany.companyProfile, CompanyBoardStep.ASSESS_VULNERABILITIES);
            const refineVulnerabilitiesStatus$ = this.dashboardService.getStatusFromServer(this.myCompany.companyProfile, CompanyBoardStep.REFINE_VULNERABILITIES);

            const statusJoin$: Observable<[HttpResponse<Status>, HttpResponse<Status>, HttpResponse<Status>]> = forkJoin(identifyThreatAgentStatus$, assessVulnerabilitiesStatus$, refineVulnerabilitiesStatus$);

            const assessVulnerabilitiesCompletion$: Observable<HttpResponse<AssessVulnerabilitiesCompletionDTO>> = statusJoin$.pipe(
                switchMap((response: [HttpResponse<Status>, HttpResponse<Status>, HttpResponse<Status>]) => {
                    this.identifyThreatAgentsStatus = response[0].body;
                    this.assessVulnerabilitiesStatus = response[1].body;
                    this.refineVulnerabilitiesStatus = response[2].body;

                    switch (this.assessVulnerabilitiesStatus) {
                        case Status.PENDING:
                        case Status.FULL: {
                            return this.completionDTOService.getAssessVulnerabilitiesCompletionByCompanyProfile(this.myCompany.companyProfile.id);
                        }
                        default: {
                            return null;
                        }
                    }
                })
            );

            if (assessVulnerabilitiesCompletion$) {
                assessVulnerabilitiesCompletion$.subscribe((response: HttpResponse<AssessVulnerabilitiesCompletionDTO>) => {
                        this.assessVulnerabilitiesCompletion = response.body;
                    },
                    error => {
                        
                    }
                );
            }
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
