import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {DataOperationMgm} from '../../entities/data-operation-mgm';
import {DataSharingService} from '../../data-sharing/data-sharing.service';
import {MyCompanyMgm} from '../../entities/my-company-mgm';
import {Subscription} from 'rxjs';
import {DataOperationsService} from './data-operations.service';
import {HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {EventManagerService} from '../../data-sharing/event-manager.service';
import {EventType} from '../../entities/enumerations/EventType.enum';
import {Event} from '../../data-sharing/event.model';
import {ActionType} from "../../entities/enumerations/ActionType.enum";
import {DataImpact} from "../../entities/enumerations/gdpr/DataImpact.enum";
import {DataThreatLikelihood} from "../../entities/enumerations/gdpr/DataThreatLikelihood.enum";
import {DataRiskLevel} from "../../entities/enumerations/gdpr/DataRiskLevel.enum";
import {OverallSecurityImpactMgm, OverallSecurityImpactMgmService} from "../../entities/overall-security-impact-mgm";
import {OverallDataThreatMgm, OverallDataThreatMgmService} from "../../entities/overall-data-threat-mgm";
import {OverallDataRiskMgm, OverallDataRiskMgmService} from "../../entities/overall-data-risk-mgm";
import {SecurityPillar} from "../../entities/enumerations/gdpr/SecurityPillar.enum";
import {SecurityImpactMgm} from "../../entities/security-impact-mgm";
import {VulnerabilityAreaMgm, VulnerabilityAreaMgmService} from "../../entities/vulnerability-area-mgm";
import {DataThreatMgm} from "../../entities/data-threat-mgm";
import {ThreatArea} from "../../entities/enumerations/gdpr/ThreatArea.enum";

@Component({
    selector: 'jhi-data-operations',
    templateUrl: './data-operations.component.html',
    styleUrls: ["./data-operations.component.css"]
})
export class DataOperationsComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];

    public securityPillarEnum = SecurityPillar;
    public securityPillars: SecurityPillar[];

    public myCompany: MyCompanyMgm;

    public dataOperations: DataOperationMgm[];
    public dataOperationsToggleMap: Map<number/*OperationID*/, boolean/*Toggled*/>;

    public securityImpactsByDataOperationAndSecurityPillarMap: Map<number/*OperationID*/, Map<SecurityPillar, SecurityImpactMgm>>;

    public overallSecurityImpacts: OverallSecurityImpactMgm[];
    public overallSecurityImpactsMap: Map<number/*OperationID*/, OverallSecurityImpactMgm>;

    public overallDataThreats: OverallDataThreatMgm[];
    public overallDataThreatsMap: Map<number/*OperationID*/, OverallDataThreatMgm>;

    public overallDataRisks: OverallDataRiskMgm[];
    public overallDataRisksMap: Map<number/*OperationID*/, OverallDataRiskMgm>;

    public dataImpactEnum = DataImpact;
    public dataImpacts: DataImpact[];

    public dataThreatLikelihoodEnum = DataThreatLikelihood;
    public threatLikelihoods: DataThreatLikelihood[];

    public dataRiskLevelEnum = DataRiskLevel;
    public dataRiskLevels: DataRiskLevel[];

    public threatAreas: ThreatArea[];
    public dataThreatsByDataOperationAndThreatAreaMap: Map<number/*OperationID*/, Map<ThreatArea, DataThreatMgm>>;

    constructor(private dataSharingService: DataSharingService,
                private eventManagerService: EventManagerService,
                private dataOperationsService: DataOperationsService,
                private overallSecurityImpactService: OverallSecurityImpactMgmService,
                private overallDataThreatService: OverallDataThreatMgmService,
                private overallDataRiskService: OverallDataRiskMgmService,
                private vulnerabilityAreaService: VulnerabilityAreaMgmService,
                private changeDetector: ChangeDetectorRef,
                private router: Router) {
    }

    ngOnInit() {
        this.subscriptions = [];

        this.securityPillars = Object.keys(SecurityPillar).map((key) => SecurityPillar[key]);
        this.threatAreas = Object.keys(ThreatArea).map((key) => ThreatArea[key]);

        this.dataImpacts = Object.keys(DataImpact).map((key) => DataImpact[key]);
        this.threatLikelihoods = Object.keys(DataThreatLikelihood).map((key) => DataThreatLikelihood[key]);
        this.dataRiskLevels = Object.keys(DataRiskLevel).map((key) => DataRiskLevel[key]);

        this.myCompany = this.dataSharingService.myCompany;
        this.fetchDataOperations();

        this.subscriptions.push(
            this.dataSharingService.myCompany$.subscribe(
                (response: MyCompanyMgm) => {
                    this.myCompany = response;

                    this.fetchDataOperations();
                }
            )
        );

        this.subscriptions.push(this.eventManagerService.observe(EventType.DATA_OPERATION_LIST_UPDATE).subscribe((event: Event) => {
            if (event && event.action === ActionType.DELETE) {
                // Clear the selected DataOperation just in case it has been deleted.
                this.dataSharingService.dataOperation = null;
                this.fetchDataOperations();
            }
        }));
    }

    private fetchDataOperations() {
        if (this.myCompany && this.myCompany.companyProfile) {

            this.dataOperationsService
                .getOperationsByCompanyProfile(this.myCompany.companyProfile.id)
                .toPromise()
                .then(
                    (response: HttpResponse<DataOperationMgm[]>) => {
                        this.dataOperations = response.body;

                        this.dataOperationsToggleMap = new Map();

                        this.securityImpactsByDataOperationAndSecurityPillarMap = new Map();

                        this.dataThreatsByDataOperationAndThreatAreaMap = new Map();

                        this.dataOperations.forEach((operation: DataOperationMgm) => {
                            this.dataOperationsToggleMap.set(operation.id, false);

                            const impactsMap: Map<SecurityPillar, SecurityImpactMgm> = new Map();

                            if (operation.impacts && operation.impacts.length) {
                                operation.impacts.forEach((impact: SecurityImpactMgm) => {
                                    impactsMap.set(impact.securityPillar, impact);
                                });
                            }

                            this.securityImpactsByDataOperationAndSecurityPillarMap.set(operation.id, impactsMap);

                            const threatsMap: Map<ThreatArea, DataThreatMgm> = new Map();

                            if (operation.threats && operation.threats.length) {
                                operation.threats.forEach((threat: DataThreatMgm) => {
                                    threatsMap.set(threat.threatArea, threat);
                                });
                            }

                            this.dataThreatsByDataOperationAndThreatAreaMap.set(operation.id, threatsMap);
                        });

                        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                            this.changeDetector.detectChanges();
                        }
                    }
                );

            this.overallSecurityImpactService.getAllByCompanyProfile(this.myCompany.companyProfile.id)
                .toPromise()
                .then(
                    (response: HttpResponse<OverallSecurityImpactMgm[]>) => {
                        this.overallSecurityImpactsMap = new Map();

                        this.overallSecurityImpacts = response.body;

                        if (this.overallSecurityImpacts && this.overallSecurityImpacts.length) {
                            this.overallSecurityImpacts.forEach((impact: OverallSecurityImpactMgm) => {
                                this.overallSecurityImpactsMap.set(impact.operation.id, impact);
                            });

                            if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                                this.changeDetector.detectChanges();
                            }
                        }
                    }
                );

            this.overallDataThreatService.getAllByCompanyProfile(this.myCompany.companyProfile.id)
                .toPromise()
                .then(
                    (response: HttpResponse<OverallDataThreatMgm[]>) => {
                        this.overallDataThreatsMap = new Map();

                        this.overallDataThreats = response.body;

                        if (this.overallDataThreats && this.overallDataThreats.length) {
                            this.overallDataThreats.forEach((threat: OverallDataThreatMgm) => {
                                this.overallDataThreatsMap.set(threat.operation.id, threat);
                            });

                            if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                                this.changeDetector.detectChanges();
                            }
                        }
                    }
                );

            this.overallDataRiskService.getAllByCompanyProfile(this.myCompany.companyProfile.id)
                .toPromise()
                .then(
                    (response: HttpResponse<OverallDataRiskMgm[]>) => {
                        this.overallDataRisksMap = new Map();

                        this.overallDataRisks = response.body;

                        if (this.overallDataRisks && this.overallDataRisks.length) {
                            this.overallDataRisks.forEach((risk: OverallDataRiskMgm) => {
                                this.overallDataRisksMap.set(risk.operation.id, risk);
                            });

                            if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                                this.changeDetector.detectChanges();
                            }
                        }
                    }
                );
        }
    }

    public selectDataOperation(dataOperation: DataOperationMgm) {
        this.dataSharingService.dataOperation = dataOperation;
    }

    trackId(index: number, item: DataOperationMgm) {
        return item.id;
    }

    ngOnDestroy(): void {
        this.changeDetector.detach();

        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    createNewDataOperation() {
        const dataOperation = new DataOperationMgm();
        dataOperation.companyProfile = this.myCompany.companyProfile;

        this.dataSharingService.dataOperation = dataOperation;

        this.router.navigate(['/privacy-board']);
    }
}
