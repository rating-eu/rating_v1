import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Status} from "../../entities/enumerations/Status.enum";
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {Subscription} from "rxjs";
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {PrivacyBoardStatus} from "../model/privacy-board-status";
import {PrivacyBoardService} from "../privacy-board.service";
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {HttpResponse} from "@angular/common/http";

@Component({
    selector: 'jhi-privacy-steps-status-widget',
    templateUrl: './privacy-steps-status-widget.component.html',
    styles: []
})
export class PrivacyStepsStatusWidgetComponent implements OnInit, OnDestroy {

    public loading: boolean = false;
    public statusEnum = Status;

    private myCompany: MyCompanyMgm;
    private _dataOperation: DataOperationMgm;
    public privacyBoardStatus: PrivacyBoardStatus;

    private subscriptions: Subscription[];

    constructor(private dataSharingService: DataSharingService,
                private privacyBoardService: PrivacyBoardService) {
    }

    ngOnInit() {
        this.subscriptions = [];

        this.myCompany = this.dataSharingService.myCompany;
        this.privacyBoardStatus = new PrivacyBoardStatus();
        this.dataSharingService.privacyBoardStatus = this.privacyBoardStatus;

        this.fetchStatus();

        this.subscriptions.push(
            this.dataSharingService.myCompany$.subscribe((response: MyCompanyMgm) => {
                this.myCompany = response;

                this.fetchStatus();
            })
        );
    }

    @Input()
    set dataOperation(dataOperation: DataOperationMgm) {
        this._dataOperation = dataOperation;
    }

    get dataOperation(): DataOperationMgm {
        return this._dataOperation;
    }

    private fetchStatus() {
        if (this._dataOperation && this.dataOperation.id && this.myCompany && this.myCompany.companyProfile) {
            this.loading = true;

            this.subscriptions.push(
                this.privacyBoardService.getPrivacyBoardStatus(this.myCompany.companyProfile.id, this._dataOperation.id).subscribe(
                    (statusResponse: HttpResponse<PrivacyBoardStatus>) => {
                        this.privacyBoardStatus = statusResponse.body;
                        this.loading = false;
                    }
                )
            );
        }else if(this.dataOperation && this.myCompany && this.myCompany.companyProfile){
            this.loading = true;
            this.privacyBoardStatus = new PrivacyBoardStatus();
            this.loading = false;
        }
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }

}
