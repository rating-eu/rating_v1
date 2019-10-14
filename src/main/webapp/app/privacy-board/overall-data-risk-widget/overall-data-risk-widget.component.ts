import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {DataImpact} from "../../entities/enumerations/gdpr/DataImpact.enum";
import {DataThreatLikelihood} from "../../entities/enumerations/gdpr/DataThreatLikelihood.enum";
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {DataRiskLevelConfigMgm, DataRiskLevelConfigMgmService} from "../../entities/data-risk-level-config-mgm";
import {HttpResponse} from "@angular/common/http";
import {DataRiskLevel} from "../../entities/enumerations/gdpr/DataRiskLevel.enum";

@Component({
    selector: 'jhi-overall-data-risk-widget',
    templateUrl: './overall-data-risk-widget.component.html',
    styleUrls: ['./overall-data-risk-widget.component.css']
})
export class OverallDataRiskWidgetComponent implements OnInit, OnDestroy {

    public loading = false;

    public dataImpactEnum = DataImpact;
    public dataImpacts: DataImpact[];

    public dataThreatLikelihoodEnum = DataThreatLikelihood;
    public threatLikelihoods: DataThreatLikelihood[];

    public dataRiskLevelEnum = DataRiskLevel;
    public dataRiskLevels: DataRiskLevel[];

    // Properties
    private _dataOperation: DataOperationMgm;

    private riskLevelConfigs: DataRiskLevelConfigMgm[];
    private riskLevelConfigsMap: Map<DataThreatLikelihood, Map<DataImpact, DataRiskLevelConfigMgm>>;
    public selectedDataRiskLevelConfig: DataRiskLevelConfigMgm;

    constructor(private dataRiskLevelConfigService: DataRiskLevelConfigMgmService,
                private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.dataImpacts = Object.keys(DataImpact).map((key) => DataImpact[key]);
        this.threatLikelihoods = Object.keys(DataThreatLikelihood).map((key) => DataThreatLikelihood[key]);
        this.dataRiskLevels = Object.keys(DataRiskLevel).map((key) => DataRiskLevel[key]);
    }

    @Input()
    set dataOperation(dataOperation: DataOperationMgm) {
        this._dataOperation = dataOperation;

        if (this._dataOperation && this._dataOperation.id) {
            this.dataRiskLevelConfigService.getAllByDataOperation(this._dataOperation.id).toPromise()
                .then((response: HttpResponse<DataRiskLevelConfigMgm[]>) => {
                    this.riskLevelConfigs = response.body;

                    this.riskLevelConfigsMap = new Map();

                    this.riskLevelConfigs.forEach((config: DataRiskLevelConfigMgm) => {
                        const likelihood: DataThreatLikelihood = config.likelihood;
                        const impact: DataImpact = config.impact;
                        const riskConfig: DataRiskLevelConfigMgm = config;

                        let impactsMap: Map<DataImpact, DataRiskLevelConfigMgm> = new Map();

                        if (this.riskLevelConfigsMap.has(likelihood)) {
                            impactsMap = this.riskLevelConfigsMap.get(likelihood);
                        } else {
                            this.riskLevelConfigsMap.set(likelihood, impactsMap);
                        }

                        impactsMap.set(impact, riskConfig)
                    });
                });
        }

        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
            this.changeDetector.detectChanges();
        }
    }

    get dataOperation(): DataOperationMgm {
        return this._dataOperation;
    }

    public selectDataRiskLevelConfig(config: DataRiskLevelConfigMgm) {
        if (!this.selectedDataRiskLevelConfig) {
            this.selectedDataRiskLevelConfig = config;
        } else {
            if (config != null && config.id === this.selectedDataRiskLevelConfig.id) {
                this.selectedDataRiskLevelConfig = null;
            }else{
                this.selectedDataRiskLevelConfig = config;
            }
        }
    }

    ngOnDestroy(): void {
        if (this.changeDetector) {
            this.changeDetector.detach();
        }
    }

    updateRiskLevel(riskLevel: DataRiskLevel) {
        if(this.selectedDataRiskLevelConfig){
            const oldRiskLevel: DataRiskLevel = this.selectedDataRiskLevelConfig.risk;

            this.selectedDataRiskLevelConfig.risk = riskLevel;

            if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                this.changeDetector.detectChanges();
            }
        }
    }
}
