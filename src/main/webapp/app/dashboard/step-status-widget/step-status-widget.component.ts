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
import {catchError, switchMap} from "rxjs/operators";
import {CompletionDtoService} from "../../dto/completion/completion-dto.service";
import {AssessVulnerabilitiesCompletionDTO} from "../../dto/completion/assess-vulnerabilities-completion";
import {of} from "rxjs/observable/of";
import {CompanyBoardStatus} from "../models/CompanyBoardStatus";
import {EmptyObservable} from "rxjs/observable/EmptyObservable";

@Component({
    selector: 'jhi-step-status-widget',
    templateUrl: './step-status-widget.component.html',
    styles: []
})
export class StepStatusWidgetComponent implements OnInit {

    public isCollapsed = false;
    private myCompany: MyCompanyMgm;
    public statusEnum = Status;
    public companyBoardStatus: CompanyBoardStatus;

    public identifyThreatAgentsStatus: Status = Status.EMPTY;
    public assessVulnerabilitiesStatus: Status = Status.EMPTY;
    public refineVulnerabilitiesStatus: Status = Status.EMPTY;

    public assessVulnerabilitiesCompletion: AssessVulnerabilitiesCompletionDTO = null;

    private closeResult: string;
    private linkAfterModal: string;
    public alertMessage: string;
    public loading: boolean = false;

    constructor(
        private dataSharingService: DatasharingService,
        private completionDTOService: CompletionDtoService,
        private dashboardService: DashboardService,
        private modalService: NgbModal,
        private router: Router) {
    }

    ngOnInit() {
        this.myCompany = this.dataSharingService.myCompany;
        this.companyBoardStatus = new CompanyBoardStatus();
        this.dataSharingService.companyBoardStatus = this.companyBoardStatus;

        this.fetchStatus();

        this.dataSharingService.myCompanyObservable.subscribe((response: MyCompanyMgm) => {
            this.myCompany = response;
            this.fetchStatus();
        });
    }

    private fetchStatus() {
        if (this.myCompany && this.myCompany.companyProfile) {
            this.loading = true;

            const identifyThreatAgentStatus$ = this.dashboardService.getStatusFromServer(this.myCompany.companyProfile, CompanyBoardStep.IDENTIFY_THREAT_AGENTS);
            const assessVulnerabilitiesStatus$ = this.dashboardService.getStatusFromServer(this.myCompany.companyProfile, CompanyBoardStep.ASSESS_VULNERABILITIES);
            const refineVulnerabilitiesStatus$ = this.dashboardService.getStatusFromServer(this.myCompany.companyProfile, CompanyBoardStep.REFINE_VULNERABILITIES);

            const statusJoin$: Observable<[HttpResponse<Status>, HttpResponse<Status>, HttpResponse<Status>]> = forkJoin(identifyThreatAgentStatus$, assessVulnerabilitiesStatus$, refineVulnerabilitiesStatus$);

            const assessVulnerabilitiesCompletion$: Observable<HttpResponse<AssessVulnerabilitiesCompletionDTO>> = statusJoin$.pipe(
                switchMap((response: [HttpResponse<Status>, HttpResponse<Status>, HttpResponse<Status>]) => {
                    this.identifyThreatAgentsStatus = response[0].body;
                    this.assessVulnerabilitiesStatus = response[1].body;
                    this.refineVulnerabilitiesStatus = response[2].body;

                    this.companyBoardStatus.identifyThreatAgentsStatus = this.identifyThreatAgentsStatus;
                    this.companyBoardStatus.assessVulnerablitiesStatus = this.assessVulnerabilitiesStatus;
                    this.companyBoardStatus.refineVulnerablitiesStatus = this.refineVulnerabilitiesStatus;

                    this.dataSharingService.companyBoardStatus = this.companyBoardStatus;

                    this.loading = false;

                    switch (this.assessVulnerabilitiesStatus) {
                        case Status.PENDING:
                        case Status.FULL:
                        case Status.EMPTY: {
                            return this.completionDTOService.getAssessVulnerabilitiesCompletionByCompanyProfile(this.myCompany.companyProfile.id);
                        }
                    }
                })
            ).catch((err) => {
                this.loading = false;
                return Observable.empty<HttpResponse<AssessVulnerabilitiesCompletionDTO>>();
            });

            if (assessVulnerabilitiesCompletion$) {
                assessVulnerabilitiesCompletion$.subscribe((response: HttpResponse<AssessVulnerabilitiesCompletionDTO>) => {
                        if (response) {
                            this.assessVulnerabilitiesCompletion = response.body;
                        }
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
