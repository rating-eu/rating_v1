import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {DataOperationMgm} from '../../entities/data-operation-mgm';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {OverallDataRiskMgm, OverallDataRiskMgmService} from '../../entities/overall-data-risk-mgm';
import {DataRiskLevel} from '../../entities/enumerations/gdpr/DataRiskLevel.enum';
import {EventManagerService} from '../../data-sharing/event-manager.service';
import {Subscription} from 'rxjs';
import {EventType} from '../../entities/enumerations/EventType.enum';
import {Event} from '../../data-sharing/event.model';
import {ActionType} from '../../entities/enumerations/ActionType.enum';

@Component({
    selector: 'jhi-data-risks-widget',
    templateUrl: './data-risks-widget.component.html',
    styles: []
})
export class DataRisksWidgetComponent implements OnInit, OnDestroy {

    public loading = false;

    public dataRiskLevelEnum = DataRiskLevel;

    private subscriptions: Subscription[];
    // Properties
    private _dataOperation: DataOperationMgm;
    public overallDataRisk: OverallDataRiskMgm;

    constructor(private overallDataRiskService: OverallDataRiskMgmService,
                private eventManagerService: EventManagerService,
                private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.subscriptions = [];

        this.subscriptions.push(this.eventManagerService.observe(EventType.DATA_RISK_LEVEL_CONFIG_LIST_UPDATE)
            .subscribe((event: Event) => {
                if (event && event.action === ActionType.UPDATE) {
                    this.fetchOverallDataRisk();
                }
            }));
    }

    @Input()
    set dataOperation(dataOperation: DataOperationMgm) {
        this._dataOperation = dataOperation;

        this.fetchOverallDataRisk();
    }

    get dataOperation(): DataOperationMgm {
        return this._dataOperation;
    }

    private fetchOverallDataRisk() {
        if (this._dataOperation && this._dataOperation.id) {
            this.overallDataRiskService.getByDataOperation(this._dataOperation.id).toPromise()
                .then((overallResponse: HttpResponse<OverallDataRiskMgm>) => {
                        this.overallDataRisk = overallResponse.body;

                        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                            this.changeDetector.detectChanges();
                        }
                    }
                ).catch((reason: HttpErrorResponse) => {
                    this.overallDataRisk = null;

                    if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                        this.changeDetector.detectChanges();
                    }
                }
            );
        }
    }

    ngOnDestroy(): void {
        if (this.changeDetector) {
            this.changeDetector.detach();
        }

        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
        }
    }
}
