import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {DataOperationMgm} from '../../entities/data-operation-mgm';
import {OverallSecurityImpactMgm, OverallSecurityImpactMgmService} from '../../entities/overall-security-impact-mgm';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

@Component({
    selector: 'jhi-security-impacts-widget',
    templateUrl: './security-impacts-widget.component.html',
    styles: []
})
export class SecurityImpactsWidgetComponent implements OnInit {

    private subscriptions: Subscription[];

    public loading = false;

    // Properties
    private _dataOperation: DataOperationMgm;

    public overallSecurityImpact: OverallSecurityImpactMgm;

    constructor(private overallSecurityImpactService: OverallSecurityImpactMgmService) {
    }

    ngOnInit() {
        this.subscriptions = [];
    }

    @Input()
    set dataOperation(dataOperation: DataOperationMgm) {
        this._dataOperation = dataOperation;

        if (this._dataOperation && this._dataOperation.id) {
            this.overallSecurityImpactService.getByDataOperation(this._dataOperation.id).toPromise()
                .then((overallResponse: HttpResponse<OverallSecurityImpactMgm>) => {
                        this.overallSecurityImpact = overallResponse.body;
                    }
                ).catch((reason: HttpErrorResponse) => {
                    this.overallSecurityImpact = null;
                }
            );
        }
    }

    get dataOperation(): DataOperationMgm {
        return this._dataOperation;
    }
}
