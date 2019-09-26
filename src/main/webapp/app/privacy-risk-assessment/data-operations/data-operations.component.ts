import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {Subscription} from "rxjs";
import {DataOperationsService} from "./data-operations.service";
import {HttpResponse} from "@angular/common/http";

@Component({
    selector: 'jhi-data-operations',
    templateUrl: './data-operations.component.html',
    styles: []
})
export class DataOperationsComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];

    public myCompany: MyCompanyMgm;
    public dataOperations: DataOperationMgm[];

    constructor(private dataSharingService: DataSharingService,
                private dataOperationsService: DataOperationsService) {
    }

    ngOnInit() {
        this.subscriptions = [];

        this.myCompany = this.dataSharingService.myCompany;
        this.fetchDataOperations();

        this.subscriptions.push(
            this.dataSharingService.myCompany$.subscribe(
                (response: MyCompanyMgm) => {
                    this.myCompany = response;

                    this.fetchDataOperations();
                }
            )
        );
    }

    private fetchDataOperations() {
        if (this.myCompany && this.myCompany.companyProfile) {

            this.subscriptions.push(
                this.dataOperationsService
                    .getOperationsByCompanyProfile(this.myCompany.companyProfile.id)
                    .subscribe(
                        (response: HttpResponse<DataOperationMgm[]>) => {
                            this.dataOperations = response.body;
                        }
                    )
            );
        }
    }

    trackId(index: number, item: DataOperationMgm) {
        return item.id;
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }
}
