import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {DataImpact} from "../../entities/enumerations/gdpr/DataImpact.enum";
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {OverallSecurityImpactMgm, OverallSecurityImpactMgmService} from "../../entities/overall-security-impact-mgm";
import {SecurityImpactMgm, SecurityImpactMgmService} from "../../entities/security-impact-mgm";
import {SecurityPillar} from "../../entities/enumerations/gdpr/SecurityPillar.enum";
import {HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {forkJoin} from "rxjs/observable/forkJoin";

@Component({
    selector: 'jhi-overall-security-impact-widget',
    templateUrl: './overall-security-impact-widget.component.html',
    styles: []
})
export class OverallSecurityImpactWidgetComponent implements OnInit, OnDestroy {

    public loading = false;
    public dataImpactEnum = DataImpact;

    // Properties
    private _dataOperation: DataOperationMgm;

    public securityPillars: SecurityPillar[];
    public securityImpacts: SecurityImpactMgm[];
    public securityImpactsMap: Map<SecurityPillar, SecurityImpactMgm>;
    public overallSecurityImpact: OverallSecurityImpactMgm;

    constructor(private securityImpactService: SecurityImpactMgmService,
                private overallSecurityImpactService: OverallSecurityImpactMgmService,
                private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.securityPillars = Object.keys(SecurityPillar).map((key) => SecurityPillar[key]);
    }

    @Input()
    set dataOperation(dataOperation: DataOperationMgm) {
        this._dataOperation = dataOperation;

        if (this._dataOperation && this._dataOperation.id) {
            const overallImpact$: Observable<HttpResponse<OverallSecurityImpactMgm>> = this.overallSecurityImpactService.getByDataOperation(this._dataOperation.id);
            let individualImpacts$: Observable<HttpResponse<SecurityImpactMgm[]>> = null;

            if (this._dataOperation.impacts && this._dataOperation.impacts.length) {
                const response: HttpResponse<SecurityImpactMgm[]> = new HttpResponse({
                    body: this._dataOperation.impacts,
                    headers: new HttpHeaders(),
                    status: 200
                });

                individualImpacts$ = Observable.of(response);
            } else {
                individualImpacts$ = this.securityImpactService.getAllByDataOperation(this._dataOperation.id);
            }

            const join$: Observable<[HttpResponse<SecurityImpactMgm[]>, HttpResponse<OverallSecurityImpactMgm>]> = forkJoin(individualImpacts$, overallImpact$);

            join$.toPromise().then(
                (response: [HttpResponse<SecurityImpactMgm[]>, HttpResponse<OverallSecurityImpactMgm>]) => {
                    if (response) {
                        this.securityImpacts = response[0].body;
                        this.overallSecurityImpact = response[1].body;

                        this.securityImpactsMap = new Map();

                        this.securityImpacts.forEach((impact: SecurityImpactMgm) => {
                            this.securityImpactsMap.set(impact.securityPillar, impact);
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

    ngOnDestroy(): void {
        this.changeDetector.detach();
    }
}
