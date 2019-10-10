import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataSharingService} from '../../data-sharing/data-sharing.service';
import {DataOperationMgm} from '../../entities/data-operation-mgm';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {PrivacyBoardStatus} from "../model/privacy-board-status";
import {Status} from "../../entities/enumerations/Status.enum";

@Component({
    selector: 'jhi-privacy-board',
    templateUrl: './privacy-board.component.html',
    styles: []
})
export class PrivacyBoardComponent implements OnInit, OnDestroy {

    public dataOperation: DataOperationMgm;
    private subscriptions: Subscription[];
    public privacyBoardStatus: PrivacyBoardStatus;
    public statusEnum = Status;

    constructor(private router: Router,
                private dataSharingService: DataSharingService) {
    }

    ngOnInit() {
        this.subscriptions = [];

        this.dataOperation = this.dataSharingService.dataOperation;

        if (!this.dataOperation) {
            this.router.navigate(['/privacy-risk-assessment/operations']);
        }

        this.subscriptions.push(
            this.dataSharingService.dataOperation$.subscribe(
                (operation: DataOperationMgm) => {
                    this.dataOperation = operation;
                }
            )
        );

        this.privacyBoardStatus = this.dataSharingService.privacyBoardStatus;

        this.subscriptions.push(
            this.dataSharingService.privacyBoardStatus$.subscribe((status: PrivacyBoardStatus) => {
                this.privacyBoardStatus = status;
            })
        );
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }
}
