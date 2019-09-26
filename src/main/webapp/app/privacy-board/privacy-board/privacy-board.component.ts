import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {Subscription} from "rxjs";

@Component({
    selector: 'jhi-privacy-board',
    templateUrl: './privacy-board.component.html',
    styles: []
})
export class PrivacyBoardComponent implements OnInit, OnDestroy {

    public dataOperation: DataOperationMgm;
    private subscriptions: Subscription[];

    constructor(private dataSharingService: DataSharingService) {
    }

    ngOnInit() {
        this.subscriptions = [];

        this.dataOperation = this.dataSharingService.dataOperation;

        this.subscriptions.push(
            this.dataSharingService.dataOperation$.subscribe(
                (operation: DataOperationMgm) => {
                    this.dataOperation = operation;
                }
            )
        )
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }
}
