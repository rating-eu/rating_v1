import {ChangeDetectorRef, Component, Input, OnInit, ViewRef} from '@angular/core';
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {Observable} from "rxjs";
import {HttpHeaders, HttpResponse} from "@angular/common/http";
import {OverallSecurityImpactMgm} from "../../entities/overall-security-impact-mgm";
import {SecurityImpactMgm} from "../../entities/security-impact-mgm";
import {forkJoin} from "rxjs/observable/forkJoin";
import {ThreatArea} from "../../entities/enumerations/gdpr/ThreatArea.enum";
import {DataThreatMgm, DataThreatMgmService} from "../../entities/data-threat-mgm";
import {OverallDataThreatMgm, OverallDataThreatMgmService} from "../../entities/overall-data-threat-mgm";
import {DataThreatLikelihood} from "../../entities/enumerations/gdpr/DataThreatLikelihood.enum";

@Component({
    selector: 'jhi-overall-data-threat-widget',
    templateUrl: './overall-data-threat-widget.component.html',
    styles: []
})
export class OverallDataThreatWidgetComponent implements OnInit {

    public loading = false;

    // Properties
    private _dataOperation: DataOperationMgm;

    public threatAreas: ThreatArea[];
    public dataThreats: DataThreatMgm[];
    public dataThreatsMap: Map<ThreatArea, DataThreatMgm>;
    public overallDataThreat: OverallDataThreatMgm;
    public threatLikelihoodEnum = DataThreatLikelihood;

    constructor(private dataThreatService: DataThreatMgmService,
                private overallDataThreatService: OverallDataThreatMgmService,
                private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.threatAreas = Object.keys(ThreatArea).map((key) => ThreatArea[key]);

    }

    @Input()
    set dataOperation(dataOperation: DataOperationMgm) {
        this._dataOperation = dataOperation;

        if (this._dataOperation && this._dataOperation.id) {
            const overallThreat$: Observable<HttpResponse<OverallDataThreatMgm>> = this.overallDataThreatService.getByDataOperation(this._dataOperation.id);
            let individualThreats$: Observable<HttpResponse<DataThreatMgm[]>> = null;

            if (this._dataOperation.impacts && this._dataOperation.impacts.length) {
                const response: HttpResponse<DataThreatMgm[]> = new HttpResponse({
                    body: this._dataOperation.threats,
                    headers: new HttpHeaders(),
                    status: 200
                });

                individualThreats$ = Observable.of(response);
            } else {
                individualThreats$ = this.dataThreatService.getAllByDataOperation(this._dataOperation.id);
            }

            const join$: Observable<[HttpResponse<DataThreatMgm[]>, HttpResponse<OverallDataThreatMgm>]> = forkJoin(individualThreats$, overallThreat$);

            join$.toPromise().then(
                (response: [HttpResponse<SecurityImpactMgm[]>, HttpResponse<OverallSecurityImpactMgm>]) => {
                    if (response) {
                        this.dataThreats = response[0].body;
                        this.overallDataThreat = response[1].body;

                        this.dataThreatsMap = new Map();

                        this.dataThreats.forEach((threat: DataThreatMgm) => {
                            this.dataThreatsMap.set(threat.threatArea, threat);
                        });

                        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                            this.changeDetector.detectChanges();
                        }
                    }
                }
            );
        }
    }

    get dataOperation(): DataOperationMgm {
        return this._dataOperation;
    }
}
