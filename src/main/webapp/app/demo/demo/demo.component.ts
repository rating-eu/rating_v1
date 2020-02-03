import {Component, OnDestroy, OnInit} from '@angular/core';
import {DemoService} from "../demo.service";
import {Router} from "@angular/router";
import {DashboardService} from "../../dashboard/dashboard.service";
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {Subscription} from "rxjs";
import {CompanyBoardStatus} from "../../dashboard/models/CompanyBoardStatus";
import {Status} from "../../entities/enumerations/Status.enum";
import {SelfAssessmentMgm, SelfAssessmentMgmService} from "../../entities/self-assessment-mgm";
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {DataOperationsService} from "../../privacy-risk-assessment/data-operations/data-operations.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {HttpResponse} from "@angular/common/http";

@Component({
    selector: 'jhi-demo',
    templateUrl: './demo.component.html',
    styles: []
})
export class DemoComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];
    public statusEnum = Status;

    private myCompany: MyCompanyMgm;

    public companyBoardStatus: CompanyBoardStatus;
    public assessments: SelfAssessmentMgm[];
    public dataOperations: DataOperationMgm[];

    constructor(private demoService: DemoService,
                private dashboardService: DashboardService,
                private dataSharingService: DataSharingService,
                private selfAssessmentService: SelfAssessmentMgmService,
                private dataOperationService: DataOperationsService,
                private router: Router) {
    }

    ngOnInit() {
        this.subscriptions = [];

        this.myCompany = this.dataSharingService.myCompany;
        this.checkDataOperations(this.myCompany);

        this.companyBoardStatus = this.dataSharingService.companyBoardStatus;

        this.subscriptions.push(this.dataSharingService.companyBoardStatus$.subscribe(
            (status: CompanyBoardStatus) => {
                this.companyBoardStatus = status;
            })
        );

        this.subscriptions.push(this.selfAssessmentService.getMySelfAssessments().subscribe(
            (assessments: SelfAssessmentMgm[]) => {
                this.assessments = assessments;
            })
        );

        this.subscriptions.push(this.dataSharingService.myCompany$.subscribe(
            (myCompany: MyCompanyMgm) => {
                this.myCompany = myCompany;

                this.checkDataOperations(this.myCompany);
            })
        );
    }

    checkDataOperations(myCompany: MyCompanyMgm) {
        if (myCompany != null && myCompany.companyProfile != null) {
            this.subscriptions.push(
                this.dataOperationService.getOperationsByCompanyProfile(this.myCompany.companyProfile.id)
                    .subscribe((response: HttpResponse<DataOperationMgm[]>) => {
                        this.dataOperations = response.body;
                    })
            )
        }
    }

    loadThreatAgentsDemo() {
        this.demoService.loadThreatAgentsDemo()
            .toPromise()
            .then((demoLoaded: boolean) => {
                if (demoLoaded) {
                    this.router.navigate(['/dashboard']);
                }
            });
    }

    loadVulnerabilitiesDemo() {
        this.demoService.loadVulnerabilitiesDemo()
            .toPromise()
            .then((demoLoaded: boolean) => {
                if (demoLoaded) {
                    this.router.navigate(['/dashboard']);
                }
            });
    }

    loadServiceDemo() {
        this.demoService.loadServiceDemo()
            .toPromise()
            .then((demoLoaded: boolean) => {
                if (demoLoaded) {
                    this.router.navigate(['/my-risk-assessments']);
                }
            });
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    loadGDPR() {
        this.demoService.loadGDPRDemo()
            .toPromise()
            .then((demoLoaded: boolean) => {
                if (demoLoaded) {
                    this.router.navigate(['/privacy-risk-assessment/operations']);
                }
            });
    }
}
