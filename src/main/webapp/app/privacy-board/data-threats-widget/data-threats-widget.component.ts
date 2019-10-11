import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {DataOperationMgm} from '../../entities/data-operation-mgm';
import {OverallDataThreatMgm, OverallDataThreatMgmService} from '../../entities/overall-data-threat-mgm';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {DataThreatLikelihood} from '../../entities/enumerations/gdpr/DataThreatLikelihood.enum';

@Component({
    selector: 'jhi-data-threats-widget',
    templateUrl: './data-threats-widget.component.html',
    styles: []
})
export class DataThreatsWidgetComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];

    public loading = false;
    public dataThreatLikelihoodEnum = DataThreatLikelihood;

    // Properties
    private _dataOperation: DataOperationMgm;

    public overallDataThreat: OverallDataThreatMgm;

    constructor(private overallDataThreatService: OverallDataThreatMgmService) {
    }

    ngOnInit() {
        this.subscriptions = [];
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    @Input()
    set dataOperation(dataOperation: DataOperationMgm) {
        this._dataOperation = dataOperation;

        if (this._dataOperation && this._dataOperation.id) {
            this.overallDataThreatService.getByDataOperation(this._dataOperation.id).toPromise()
                .then((overallResponse: HttpResponse<OverallDataThreatMgm>) => {
                        this.overallDataThreat = overallResponse.body;
                    }
                ).catch((reason: HttpErrorResponse) => {
                    this.overallDataThreat = null;
                }
            );
        }
    }

    get dataOperation(): DataOperationMgm {
        return this._dataOperation;
    }
}
