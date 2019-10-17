import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {DataImpact} from "../../entities/enumerations/gdpr/DataImpact.enum";
import {DataThreatLikelihood} from "../../entities/enumerations/gdpr/DataThreatLikelihood.enum";
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {DataRiskLevelConfigMgm, DataRiskLevelConfigMgmService} from "../../entities/data-risk-level-config-mgm";
import {HttpResponse} from "@angular/common/http";
import {DataRiskLevel} from "../../entities/enumerations/gdpr/DataRiskLevel.enum";
import {OverallDataRiskMgm, OverallDataRiskMgmService} from "../../entities/overall-data-risk-mgm";
import {OverallSecurityImpactMgm, OverallSecurityImpactMgmService} from "../../entities/overall-security-impact-mgm";
import {OverallDataThreatMgm, OverallDataThreatMgmService} from "../../entities/overall-data-threat-mgm";
import {Observable} from "rxjs";
import {forkJoin} from "rxjs/observable/forkJoin";
import {OverallDataRiskWidgetService} from "./overall-data-risk-widget.service";
import {EventManagerService} from "../../data-sharing/event-manager.service";
import {Event} from "../../data-sharing/event.model";
import {EventType} from "../../entities/enumerations/EventType.enum";
import {ActionType} from "../../entities/enumerations/ActionType.enum";

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

    public overallSecurityImpact: OverallSecurityImpactMgm;
    public overallDataThreat: OverallDataThreatMgm;
    public overallDataRisk: OverallDataRiskMgm;

    // Properties
    private _dataOperation: DataOperationMgm;

    private riskLevelConfigs: DataRiskLevelConfigMgm[];
    private riskLevelConfigsMap: Map<DataThreatLikelihood, Map<DataImpact, DataRiskLevelConfigMgm>>;
    public selectedDataRiskLevelConfig: DataRiskLevelConfigMgm;

    constructor(private dataRiskLevelConfigService: DataRiskLevelConfigMgmService,
                private overallSecurityImpactService: OverallSecurityImpactMgmService,
                private overallDataThreatService: OverallDataThreatMgmService,
                private overallDataRiskService: OverallDataRiskMgmService,
                private riskWidgetService: OverallDataRiskWidgetService,
                private eventManagerService: EventManagerService,
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

                    this.riskLevelConfigsMap = this.mapRiskLevelConfigs(this.riskLevelConfigs);
                });

            const join$: Observable<[HttpResponse<OverallSecurityImpactMgm>, HttpResponse<OverallDataThreatMgm>, HttpResponse<OverallDataThreatMgm>]>
                = forkJoin(
                this.overallSecurityImpactService.getByDataOperation(this._dataOperation.id),
                this.overallDataThreatService.getByDataOperation(this._dataOperation.id),
                this.overallDataRiskService.getByDataOperation(this._dataOperation.id),
            );

            join$.toPromise().then((response: [HttpResponse<OverallSecurityImpactMgm>, HttpResponse<OverallDataThreatMgm>, HttpResponse<OverallDataThreatMgm>]) => {
                if (response) {
                    this.overallSecurityImpact = response[0].body;
                    this.overallDataThreat = response[1].body;
                    this.overallDataRisk = response[2].body;
                }
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
            } else {
                this.selectedDataRiskLevelConfig = config;
            }
        }
    }

    ngOnDestroy(): void {
        if (this.changeDetector) {
            this.changeDetector.detach();
        }
    }

    /**
     * Update the RiskLevel configs.
     * This may generate a cascade effect of updates on the neighbours of the selected config.
     * @param riskLevel The new RiskLevel.
     */
    updateRiskLevelConfigs(riskLevel: DataRiskLevel) {
        if (this.selectedDataRiskLevelConfig) {
            this.selectedDataRiskLevelConfig.risk = riskLevel;

            const rationale: string = this.selectedDataRiskLevelConfig.rationale;

            const riskValue: number = this.riskWidgetService.riskValue(riskLevel);
            const likelihoodImpactProduct: number = this.riskWidgetService.likelihoodImpactProductValue(this.selectedDataRiskLevelConfig);

            // We also need to update all the preceding and succeeding RiskLevelConfigs.
            // E.g: The preceding configs are the ones with (Likelihood x Impact) < (selected.Likelihood x selected.Impact)
            this.riskLevelConfigs.forEach((config: DataRiskLevelConfigMgm) => {
                const currentLikeImpactProduct: number = this.riskWidgetService.likelihoodImpactProductValue(config);
                const currentRiskValue: number = this.riskWidgetService.riskValue(config.risk);

                if (currentLikeImpactProduct < likelihoodImpactProduct) {
                    if (currentRiskValue > riskValue) { // Reduce the RiskLevel of the preceding configs.
                        config.risk = riskLevel;
                        config.rationale = rationale;
                    } else {
                        // Do nothing since they have already a lower level of risk.
                    }
                } else {
                    if (currentRiskValue < riskValue) { // Increase the RiskLevel of the succeeding configs.
                        config.risk = riskLevel;
                        config.rationale = rationale;
                    } else {
                        // Do nothing since they have already a higher level of risk.
                    }
                }
            });

            if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                this.changeDetector.detectChanges();
            }
        }
    }

    submitRiskLevelConfigs() {
        if (this.riskLevelConfigs && this.riskLevelConfigs.length) {
            this.dataRiskLevelConfigService.updateAllConfigsByDataOperation(this._dataOperation, this.riskLevelConfigs)
                .toPromise()
                .then((response: HttpResponse<DataRiskLevelConfigMgm[]>) => {
                    if (response && response.body) {
                        this.riskLevelConfigs = response.body;
                        this.riskLevelConfigsMap = this.mapRiskLevelConfigs(this.riskLevelConfigs);

                        // To hide the edit form
                        this.selectedDataRiskLevelConfig = null;

                        // Notify the DataRisks widget to update its value.
                        this.eventManagerService.broadcast(new Event(EventType.DATA_RISK_LEVEL_CONFIG_LIST_UPDATE, ActionType.UPDATE));

                        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                            this.changeDetector.detectChanges();
                        }
                    }
                });
        }
    }

    private mapRiskLevelConfigs(riskLevelConfigs: DataRiskLevelConfigMgm[]) {
        const configsMap: Map<DataThreatLikelihood, Map<DataImpact, DataRiskLevelConfigMgm>> = new Map();

        if(riskLevelConfigs && riskLevelConfigs.length){
            this.riskLevelConfigs.forEach((config: DataRiskLevelConfigMgm) => {
                const likelihood: DataThreatLikelihood = config.likelihood;
                const impact: DataImpact = config.impact;
                const riskConfig: DataRiskLevelConfigMgm = config;

                let impactsMap: Map<DataImpact, DataRiskLevelConfigMgm> = new Map();

                if (configsMap.has(likelihood)) {
                    impactsMap = configsMap.get(likelihood);
                } else {
                    configsMap.set(likelihood, impactsMap);
                }

                impactsMap.set(impact, riskConfig)
            });
        }

        return configsMap;
    }
}
