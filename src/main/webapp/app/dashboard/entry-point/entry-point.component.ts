import {Component, OnDestroy, OnInit} from '@angular/core';
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {CompanyBoardStatus} from "../models/CompanyBoardStatus";
import {Subscription} from "rxjs";
import {Status} from "../../entities/enumerations/Status.enum";
import {DataSharingService} from "../../data-sharing/data-sharing.service";

@Component({
    selector: 'jhi-entry-point',
    templateUrl: './entry-point.component.html',
    styles: []
})
export class EntryPointComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];

    public myCompany: MyCompanyMgm = undefined;
    public companyBoardStatus: CompanyBoardStatus;
    public statusEnum = Status;

    constructor(private dataSharingService: DataSharingService) {
    }

    ngOnInit() {
        this.subscriptions = [];

        // Get the current MyCompany
        this.myCompany = this.dataSharingService.myCompany;
        this.companyBoardStatus = this.dataSharingService.companyBoardStatus;

        // Listen for updates of MyCompany
        this.subscriptions.push(
            this.dataSharingService.myCompany$.subscribe((myCompany: MyCompanyMgm) => {
                this.myCompany = myCompany;
            })
        );

        // Listen for updates of CompanyBoardStatus
        this.subscriptions.push(
            this.dataSharingService.companyBoardStatus$.subscribe((companyBoardStatus: CompanyBoardStatus) => {
                this.companyBoardStatus = companyBoardStatus;
            })
        );
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                if (subscription) {
                    subscription.unsubscribe();
                }
            });
        }
    }
}
