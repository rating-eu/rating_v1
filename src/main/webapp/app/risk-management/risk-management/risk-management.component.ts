import { ImpactEvaluationService } from './../../impact-evaluation/impact-evaluation.service';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { RiskManagementService } from '../risk-management.service';
import { CriticalLevelMgm, CriticalLevelMgmService } from '../../entities/critical-level-mgm';
import { JhiAlertService } from '../../../../../../node_modules/ng-jhipster';
import { ImpactLevelDescriptionMgm, ImpactLevelDescriptionMgmService } from '../../entities/impact-level-description-mgm';
import { ImpactLevelMgm, ImpactLevelMgmService } from '../../entities/impact-level-mgm';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'risk-management',
    templateUrl: './risk-management.component.html',
    styleUrls: ['./risk-management.component.css'],
})
export class RiskManagementComponent implements OnInit {
    public isLikelihoodCollapsed = true;
    public isVulnerabilityCollapsed = true;
    public isCriticalCollapsed = true;
    public isLevelsCollapsed = true;
    public isConsequenceCollapsed = true;
    public selectedRow: number;
    public selectedColumn: number;
    public squareColumnElement: number[];
    public squareRowElement: number[];
    public lastSquareRowElement: number;
    private mySelf: SelfAssessmentMgm;
    public criticalLevel: CriticalLevelMgm;
    public impactMinLevelValues: number[] = [];
    public impactMaxLevelValues: number[] = [];
    public impactLevelDescriptions: ImpactLevelDescriptionMgm[];
    public impactLevels: ImpactLevelMgm[];
    public impactLevelsMap: Map<number, ImpactLevelMgm>;
    public selectedImpactLevel: ImpactLevelMgm = null;
    public updateErrors: boolean;
    private needToCreateImpactLevels: boolean;

    constructor(
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private criticalLevelService: CriticalLevelMgmService,
        private riskService: RiskManagementService,
        private jhiAlertService: JhiAlertService,
        private impactLevelDescriptionService: ImpactLevelDescriptionMgmService,
        private impactLevelService: ImpactLevelMgmService,
        private impactEvaluationService: ImpactEvaluationService
    ) {
    }

    ngOnInit() {
        if (this.mySelf = this.mySelfAssessmentService.getSelfAssessment()) {
            // TODO Chiamata per il recupero degli impact level
            forkJoin(
                this.impactLevelDescriptionService.query(null),
                this.impactLevelService.findAllBySelfAssessment(this.mySelf.id)
            ).toPromise()
                .then((response: [HttpResponse<ImpactLevelDescriptionMgm[]>, HttpResponse<ImpactLevelMgm[]>]) => {
                    this.impactLevelDescriptions = response[0].body;
                    this.impactLevels = response[1].body;

                    // ImpactLevels already exist
                    if (this.impactLevels && this.impactLevels.length > 0) {
                        // No need to create ImpactLevels, just update them.
                        this.needToCreateImpactLevels = false;

                    } else {
                        // Need to create ImpactLevels for the first time.
                        this.needToCreateImpactLevels = true;
                        this.impactLevels = [];

                        this.impactLevelDescriptions.forEach((description: ImpactLevelDescriptionMgm) => {
                            this.impactLevels.push(new ImpactLevelMgm(undefined, this.mySelf.id, description.impact, 0, 0));
                        });
                    }

                    this.impactLevelsMap = new Map<number, ImpactLevelMgm>();

                    this.impactLevels.forEach((impactLevel: ImpactLevelMgm) => {
                        this.impactLevelsMap.set(impactLevel.impact, impactLevel);
                    });

                    if (this.needToCreateImpactLevels) {
                        this.impactLevelService.createAll(this.impactLevels)
                            .toPromise()
                            .then((response2: HttpResponse<ImpactLevelMgm[]>) => {
                                // Update the IDs of the ImpactLevels created locally
                                if (response2) {
                                    response2.body.forEach((impactLevel: ImpactLevelMgm) => {
                                        if (this.impactLevelsMap.has(impactLevel.impact)) {
                                            this.impactLevelsMap.get(impactLevel.impact).id = impactLevel.id;
                                        }
                                    });
                                }
                            });
                    }
                });
        }

        this.riskService.getCriticalLevel(this.mySelf).toPromise().then((res) => {
            if (res) {
                this.criticalLevel = res;
            } else {
                this.criticalLevel = new CriticalLevelMgm();
                this.criticalLevel.side = 5;
                this.criticalLevel.lowLimit = 4;
                this.criticalLevel.mediumLimit = 14;
                this.criticalLevel.highLimit = 25;
                this.criticalLevel.selfAssessment = this.mySelf;
                this.criticalLevelService.create(this.criticalLevel).toPromise().then((res2) => {
                    if (res2) {
                        this.criticalLevel = res2.body;
                    }
                });
            }
            this.squareColumnElement = [];
            this.squareRowElement = [];
            this.lastSquareRowElement = this.criticalLevel.side + 1;
            for (let i = 1; i <= this.criticalLevel.side; i++) {
                this.squareColumnElement.push(i);
            }
            for (let i = 1; i <= this.criticalLevel.side + 1; i++) {
                this.squareRowElement.push(i);
            }
        });
    }

    public selectImpactLevel(impactLevel: ImpactLevelMgm) {
        if (this.selectedImpactLevel) {
            if (this.selectedImpactLevel.id === impactLevel.id) {
                this.selectedImpactLevel = null;
            } else {
                this.selectedImpactLevel = impactLevel;
            }
        } else {
            this.selectedImpactLevel = impactLevel;
        }
    }

    public switchOnCollapsible(collapsible: string) {
        switch (collapsible) {
            case 'consequence': {
                this.isVulnerabilityCollapsed = true;
                this.isCriticalCollapsed = true;
                this.isLevelsCollapsed = true;
                this.isLikelihoodCollapsed = true;
                this.isConsequenceCollapsed = false;
                break;
            }
            case 'likelihood': {
                this.isVulnerabilityCollapsed = true;
                this.isCriticalCollapsed = true;
                this.isLevelsCollapsed = true;
                this.isLikelihoodCollapsed = false;
                this.isConsequenceCollapsed = true;
                break;
            }
            case 'vulnerability': {
                this.isVulnerabilityCollapsed = false;
                this.isCriticalCollapsed = true;
                this.isLevelsCollapsed = true;
                this.isLikelihoodCollapsed = true;
                this.isConsequenceCollapsed = true;
                break;
            }
            case 'critical-level': {
                this.isVulnerabilityCollapsed = true;
                this.isCriticalCollapsed = false;
                this.isLevelsCollapsed = true;
                this.isLikelihoodCollapsed = true;
                this.isConsequenceCollapsed = true;
                break;
            }
            case 'none': {
                this.isVulnerabilityCollapsed = true;
                this.isCriticalCollapsed = true;
                this.isLevelsCollapsed = true;
                this.isLikelihoodCollapsed = true;
                this.isConsequenceCollapsed = true;
                break;
            }
        }
    }

    public updateImpactLevel(impactLevel: ImpactLevelMgm) {
        if (impactLevel && impactLevel.id !== undefined) {
            this.impactLevelService.update(impactLevel)
                .toPromise()
                .then((response: HttpResponse<ImpactLevelMgm>) => {
                    console.log('ImpactLevel updated: ' + JSON.stringify(impactLevel));
                });
        }
    }

    public updateImpactLevels() {
        if (this.impactLevelsValidity()) {
            this.updateErrors = false;
            const levelsToUpdate: ImpactLevelMgm[] = [];
            const updateElems = Array.from(this.impactLevelsMap.values());
            this.impactEvaluationService.updateAll(levelsToUpdate).toPromise().then((res) => {
                this.impactEvaluationService.sendUpdateForImpactLevelToSubscriptor(res);
                this.ngOnInit();
            });
        } else {
            this.updateErrors = true;
        }
    }

    private impactLevelsValidity(): boolean {
        let boundaryLowElem = 0;
        const impactsLvl = Array.from(this.impactLevelsMap.values());
        for (const elem of impactsLvl) {
            if (elem && elem.id !== undefined) {
                if (elem.minLoss > boundaryLowElem) {
                    boundaryLowElem = elem.minLoss;
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    public criticalLevelUpdate(level: string) {
        const newLimit = this.selectedRow * this.selectedColumn;
        // setto il nuovo limite
        switch (level) {
            case 'low': {
                const oldLowLimit = this.criticalLevel.lowLimit;
                this.criticalLevel.lowLimit = newLimit;
                if (this.criticalLevel.lowLimit >= this.criticalLevel.mediumLimit) {
                    this.criticalLevel.mediumLimit = undefined;
                } else {
                    if (!this.criticalLevel.mediumLimit && !this.criticalLevel.highLimit) {
                        this.criticalLevel.mediumLimit = this.criticalLevel.side * this.criticalLevel.side;
                    } else if (!this.criticalLevel.mediumLimit && (this.criticalLevel.highLimit !== undefined || this.criticalLevel.highLimit !== null)) {
                        this.criticalLevel.mediumLimit = oldLowLimit;
                    }
                }
                if (this.criticalLevel.lowLimit === this.criticalLevel.side * this.criticalLevel.side) {
                    this.criticalLevel.highLimit = undefined;
                }
                break;
            }
            case 'medium': {
                this.criticalLevel.mediumLimit = newLimit;
                if (this.criticalLevel.mediumLimit === 1) {
                    this.criticalLevel.lowLimit = undefined;
                    if (!this.criticalLevel.highLimit) {
                        this.criticalLevel.mediumLimit = this.criticalLevel.side * this.criticalLevel.side;
                    }
                } else {
                    if (this.criticalLevel.mediumLimit <= this.criticalLevel.lowLimit && this.criticalLevel.mediumLimit !== 1) {
                        this.criticalLevel.lowLimit = this.criticalLevel.mediumLimit - 1;
                    }
                    if (!this.criticalLevel.highLimit) {
                        this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
                    } else if (this.criticalLevel.mediumLimit === this.criticalLevel.side * this.criticalLevel.side) {
                        this.criticalLevel.highLimit = undefined;
                    }
                }
                break;
            }
            case 'high': {
                this.criticalLevel.highLimit = newLimit;
                if (this.criticalLevel.highLimit === 1) {
                    this.criticalLevel.lowLimit = undefined;
                    this.criticalLevel.mediumLimit = undefined;
                    this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
                } else {
                    if (this.criticalLevel.highLimit <= this.criticalLevel.lowLimit && this.criticalLevel.highLimit !== 1) {
                        this.criticalLevel.lowLimit = this.criticalLevel.highLimit - 1;
                        this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
                    } else if (this.criticalLevel.highLimit < this.criticalLevel.mediumLimit && this.criticalLevel.highLimit > this.criticalLevel.lowLimit) {
                        this.criticalLevel.mediumLimit = this.criticalLevel.highLimit - 1;
                        this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
                    } else if (this.criticalLevel.highLimit < this.criticalLevel.mediumLimit) {
                        this.criticalLevel.mediumLimit = this.criticalLevel.highLimit - 1;
                        this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
                    } else {
                        this.criticalLevel.highLimit = this.criticalLevel.side * this.criticalLevel.side;
                    }
                }
                break;
            }
        }
        this.criticalLevelService.update(this.criticalLevel).toPromise().then((res) => {
            if (res) {
                this.criticalLevel = res.body;
                this.jhiAlertService.success('hermeneutApp.messages.saved', null, null);
                // location.reload();
                this.riskService.sendUpdateForCriticalLevelToSubscriptor(this.criticalLevel);
            }
        });
    }

    public whichLevel(row: number, column: number): string {
        const level = row * column;
        if (level <= this.criticalLevel.lowLimit) {
            return 'low';
        } else if (level > this.criticalLevel.lowLimit && level <= this.criticalLevel.mediumLimit) {
            return 'medium';
        } else if (level > this.criticalLevel.mediumLimit && level <= this.criticalLevel.highLimit) {
            return 'high';
        } else if (this.criticalLevel.mediumLimit === undefined && level <= this.criticalLevel.highLimit) {
            return 'high';
        } else if (this.criticalLevel.lowLimit === undefined && level <= this.criticalLevel.mediumLimit) {
            return 'medium';
        } else {
            return 'undefined';
        }
    }

    public selectedMatrixCell(row: number, column: number) {
        if (this.selectedColumn === column && this.selectedRow === row) {
            this.selectedColumn = undefined;
            this.selectedRow = undefined;
            this.isLevelsCollapsed = true;
        } else {
            this.selectedRow = row;
            this.selectedColumn = column;
            this.isLevelsCollapsed = false;
        }
    }

    public closeLevelSelection() {
        this.selectedColumn = undefined;
        this.selectedRow = undefined;
        this.isLevelsCollapsed = true;
    }

}
