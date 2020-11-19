import {AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {DashboardService} from "../dashboard.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {CompanyBoardStep} from "../../entities/enumerations/CompanyBoardStep.enum";
import {forkJoin} from "rxjs/observable/forkJoin";
import {Observable, Subscription} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {Status} from "../../entities/enumerations/Status.enum";
import {switchMap} from "rxjs/operators";
import {CompletionDtoService} from "../../dto/completion/completion-dto.service";
import {AssessVulnerabilitiesCompletionDTO} from "../../dto/completion/assess-vulnerabilities-completion";
import {CompanyBoardStatus} from "../models/CompanyBoardStatus";
import {of} from "rxjs/observable/of";
import {QuestionnaireStatusMgm, QuestionnaireStatusMgmService} from "../../entities/questionnaire-status-mgm";
import {QuestionnairePurpose} from "../../entities/enumerations/QuestionnairePurpose.enum";
import {Role} from '../../entities/enumerations/Role.enum';

@Component({
    selector: 'jhi-step-status-widget',
    templateUrl: './step-status-widget.component.html',
    styles: []
})
export class StepStatusWidgetComponent implements OnInit, AfterViewChecked, OnDestroy {

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
    private loading: boolean = false;
    public isLoading: boolean = false;

    private subscriptions: Subscription[];
    public questionnaireStatuses: QuestionnaireStatusMgm[];

    public vulnerabilityAssessment: QuestionnaireStatusMgm;

    constructor(
        private dataSharingService: DataSharingService,
        private completionDTOService: CompletionDtoService,
        private questionnaireStatusService: QuestionnaireStatusMgmService,
        private dashboardService: DashboardService,
        private modalService: NgbModal,
        private router: Router,
        private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.questionnaireStatuses = [];

        this.myCompany = this.dataSharingService.myCompany;
        this.companyBoardStatus = new CompanyBoardStatus();
        this.dataSharingService.companyBoardStatus = this.companyBoardStatus;

        this.fetchStatus();
        this.fetchQuestionnaireStatuses();
        this.fetchVulnerabilitiesCompletions();

        this.subscriptions.push(
            this.dataSharingService.myCompany$.subscribe((response: MyCompanyMgm) => {
                this.myCompany = response;
                this.fetchStatus();
                this.fetchQuestionnaireStatuses();
                this.fetchVulnerabilitiesCompletions();
            })
        );

        this.subscriptions.push(
            this.dataSharingService.vulnerabilityAssessment$.pipe(
                switchMap(
                    (vulnerabilityAssessment: QuestionnaireStatusMgm) => {
                        this.vulnerabilityAssessment = vulnerabilityAssessment;
                        this.dataSharingService.cisoQuestionnaireStatus = vulnerabilityAssessment;
                        this.dataSharingService.externalQuestionnaireStatus = vulnerabilityAssessment.refinement;

                        if (this.vulnerabilityAssessment) {
                            this.assessVulnerabilitiesStatus = this.vulnerabilityAssessment.status;
                            this.companyBoardStatus.assessVulnerablitiesStatus = this.assessVulnerabilitiesStatus;
                            this.dataSharingService.companyBoardStatus = this.companyBoardStatus;
                        }

                        return this.completionDTOService.getAssessVulnerabilitiesCompletionByCompanyProfileAndQuestionnaireStatus(this.myCompany.companyProfile.id, this.vulnerabilityAssessment.id);
                    }
                )
            ).subscribe(
                (response: HttpResponse<AssessVulnerabilitiesCompletionDTO>) => {
                    this.assessVulnerabilitiesCompletion = response.body;

                    if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                        this.changeDetector.detectChanges();
                    }
                }
            )
        );
    }

    ngAfterViewChecked(): void {
        this.isLoading = this.loading;
        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
            this.changeDetector.detectChanges();
        }
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
                        default: {
                            return of(new HttpResponse<AssessVulnerabilitiesCompletionDTO>({body: new AssessVulnerabilitiesCompletionDTO()}));
                        }
                    }
                })
            ).catch((err) => {
                this.loading = false;
                return of(new HttpResponse<AssessVulnerabilitiesCompletionDTO>({body: new AssessVulnerabilitiesCompletionDTO()}));
            });

            if (assessVulnerabilitiesCompletion$) {
                this.subscriptions.push(
                    assessVulnerabilitiesCompletion$.subscribe((response: HttpResponse<AssessVulnerabilitiesCompletionDTO>) => {
                            if (response) {
                                this.assessVulnerabilitiesCompletion = response.body;
                            }
                        }
                    )
                );
            }
        }
    }

    private fetchQuestionnaireStatuses() {
        if (this.myCompany && this.myCompany.companyProfile) {
            this.subscriptions.push(
                this.questionnaireStatusService.getAllQuestionnaireStatusesByCompanyProfileQuestionnairePurposeAndRole(this.myCompany.companyProfile, QuestionnairePurpose.SELFASSESSMENT, Role.ROLE_CISO)
                    .catch((err) => {
                        return of([]);
                    })
                    .subscribe((response: QuestionnaireStatusMgm[]) => {
                        this.questionnaireStatuses = response;

                        if (this.questionnaireStatuses && this.questionnaireStatuses.length) {
                            this.vulnerabilityAssessment = this.questionnaireStatuses[0];
                            this.dataSharingService.vulnerabilityAssessment = this.vulnerabilityAssessment;
                        } else {

                        }
                    })
            );
        }
    }

    private fetchVulnerabilitiesCompletions() {
        if (this.myCompany && this.myCompany.companyProfile) {
            this.subscriptions.push(
                this.dataSharingService.vulnerabilityAssessment$.pipe(
                    switchMap(
                        (vulnerabilityAssessment: QuestionnaireStatusMgm) => {
                            this.vulnerabilityAssessment = vulnerabilityAssessment;

                            if (this.vulnerabilityAssessment) {
                                this.assessVulnerabilitiesStatus = this.vulnerabilityAssessment.status;
                                this.companyBoardStatus.assessVulnerablitiesStatus = this.assessVulnerabilitiesStatus;
                                this.dataSharingService.companyBoardStatus = this.companyBoardStatus;
                            }

                            return this.completionDTOService.getAssessVulnerabilitiesCompletionByCompanyProfileAndQuestionnaireStatus(this.myCompany.companyProfile.id, this.vulnerabilityAssessment.id);
                        }
                    )
                ).subscribe(
                    (response: HttpResponse<AssessVulnerabilitiesCompletionDTO>) => {
                        this.assessVulnerabilitiesCompletion = response.body;

                        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                            this.changeDetector.detectChanges();
                        }
                    }
                )
            );
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

    ngOnDestroy(): void {
        if (this.changeDetector) {
            this.changeDetector.detach();
        }

        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }
}
