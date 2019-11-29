import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {Subscription} from "rxjs";

@Component({
    selector: 'jhi-risk-config',
    templateUrl: './risk-config.component.html',
    styleUrls: ['./risk-config.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RiskConfigComponent implements OnInit, OnDestroy {

    public dataOperation: DataOperationMgm;
    private subscription: Subscription;

    constructor(
        private dataSharingService: DataSharingService
    ) {
    }

    ngOnInit() {
        this.dataOperation = this.dataSharingService.dataOperation;
        this.subscription = this.dataSharingService.dataOperation$.subscribe(
            (dataOperation: DataOperationMgm) => {
                this.dataOperation = dataOperation;
            }
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
