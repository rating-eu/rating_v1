import {Component, OnDestroy, OnInit} from '@angular/core';
import {DemoService} from "../demo.service";
import {Router} from "@angular/router";
import {DashboardService} from "../../dashboard/dashboard.service";
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {Subscription} from "rxjs";
import {CompanyBoardStatus} from "../../dashboard/models/CompanyBoardStatus";
import {Status} from "../../entities/enumerations/Status.enum";

@Component({
    selector: 'jhi-demo',
    templateUrl: './demo.component.html',
    styles: []
})
export class DemoComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];
    public statusEnum = Status;

    public companyBoardStatus: CompanyBoardStatus;

    constructor(private demoService: DemoService,
                private dashboardService: DashboardService,
                private dataSharingService: DataSharingService,
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

    loadVulnerabilitiesDemo(){
        this.demoService.loadVulnerabilitiesDemo()
            .toPromise()
            .then((demoLoaded: boolean) => {
               if(demoLoaded){
                   this.router.navigate(['/dashboard']);
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
