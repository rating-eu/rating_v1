import {Component, OnDestroy, OnInit} from '@angular/core';
import {DemoService} from "../demo.service";
import {Router} from "@angular/router";
import {DashboardService} from "../../dashboard/dashboard.service";
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {Subscription} from "rxjs";
import {CompanyBoardStatus} from "../../dashboard/models/CompanyBoardStatus";
import {Status} from "../../entities/enumerations/Status.enum";
import {SelfAssessmentMgm, SelfAssessmentMgmService} from "../../entities/self-assessment-mgm";
import {DataOperationMgmService} from "../../entities/data-operation-mgm";

@Component({
    selector: 'jhi-demo',
    templateUrl: './demo.component.html',
    styles: []
})
export class DemoComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];
    public statusEnum = Status;

    public companyBoardStatus: CompanyBoardStatus;
    public assessments: SelfAssessmentMgm[];

    constructor(private demoService: DemoService,
                private dashboardService: DashboardService,
                private dataSharingService: DataSharingService,
                private selfAssessmentService: SelfAssessmentMgmService,
                private dataOperationService: DataOperationMgmService,
                private router: Router) {
    }

    ngOnInit() {
        this.subscriptions = [];

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
}
