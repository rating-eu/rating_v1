import {Component, Input, OnInit} from '@angular/core';
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {OverallDataRiskMgm, OverallDataRiskMgmService} from "../../entities/overall-data-risk-mgm";

@Component({
    selector: 'jhi-data-risks-widget',
    templateUrl: './data-risks-widget.component.html',
    styles: []
})
export class DataRisksWidgetComponent implements OnInit {

    public loading = false;

    // Properties
    private _dataOperation: DataOperationMgm;

    public overallDataRisk: OverallDataRiskMgm;

    constructor(private overallDataiskService: OverallDataRiskMgmService) {
    }

    ngOnInit() {
    }

    @Input()
    set dataOperation(dataOperation: DataOperationMgm) {
        this._dataOperation = dataOperation;

        if (this._dataOperation && this._dataOperation.id) {
            this.overallDataiskService.getByDataOperation(this._dataOperation.id).toPromise()
                .then((overallResponse: HttpResponse<OverallDataRiskMgm>) => {
                        this.overallDataRisk = overallResponse.body;
                    }
                ).catch((reason: HttpErrorResponse) => {
                    this.overallDataRisk = null;
                }
            );
        }
    }

    get dataOperation(): DataOperationMgm {
        return this._dataOperation;
    }
}
