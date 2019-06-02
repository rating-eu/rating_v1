/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {RiskBoardStepEnum} from '../../entities/enumerations/RiskBoardStep.enum';
import {RiskBoardService, RiskBoardStatus} from '../risk-board.service';
import {MyAssetRisk} from './../../risk-management/model/my-asset-risk.model';
import {CriticalLevelMgm} from './../../entities/critical-level-mgm/critical-level-mgm.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {RiskManagementService} from '../../risk-management/risk-management.service';
import {Status} from "../../entities/enumerations/Status.enum";
import {DatasharingService} from "../../datasharing/datasharing.service";
import {switchMap} from "rxjs/operators";
import {ImpactMode} from "../../entities/enumerations/ImpactMode.enum";
import {forkJoin} from "rxjs/observable/forkJoin";
import {Observable, Subscription} from "rxjs";
import {of} from "rxjs/observable/of";

@Component({
    selector: 'jhi-risk-square-widget',
    templateUrl: './risk-square-widget.component.html',
    styleUrls: ['risk-square-widget.component.css']
})

export class RiskSquareWidgetComponent implements OnInit, OnDestroy {
    public loadingRiskLevel = false;
    public loadingAssetsAndAttacks = false;
    public attackCosts = false;
    public isCollapsed = true;
    private selfAssessment: SelfAssessmentMgm;
    private riskBoardStatus: RiskBoardStatus;
    public criticalLevel: CriticalLevelMgm;
    public myAssetsAtRisk: MyAssetRisk[];
    public squareColumnElement: number[];
    public squareRowElement: number[];
    public lastSquareRowElement: number;
    public bostonSquareCells: string[][] = [];
    public assetsToolTip: Map<number, string> = new Map<number, string>();
    public assetToolTipLoaded = false;
    public assetToolTipLoadedTimer = false;
    private dashboardStatus = RiskBoardStepEnum;
    private subscriptions: Subscription[];

    constructor(
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private riskService: RiskManagementService,
        private dashService: RiskBoardService,
        private dataSharingService: DatasharingService
    ) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.loadingRiskLevel = true;
        this.loadingAssetsAndAttacks = true;
        this.selfAssessment = this.dataSharingService.selfAssessment;
        this.riskBoardStatus = this.dataSharingService.riskBoardStatus;

        if (this.selfAssessment) {
            this.fetchCriticalLevelAndAssetsAtRisk().toPromise().then(
                (response: [CriticalLevelMgm, MyAssetRisk[]]) => {
                    if (response && response.length && response.length === 2) {
                        this.handleCriticalLevelAndAssetsAtRisk(response[0], response[1]);
                    }
                }
            );
        }

        if (this.riskBoardStatus) {
            this.extractAttackStatus();
        }

        this.subscriptions.push(
            this.dataSharingService.riskBoardStatusObservable.subscribe((response: RiskBoardStatus) => {
                this.riskBoardStatus = response;
                this.extractAttackStatus();
            })
        );

        this.dataSharingService.selfAssessmentObservable.pipe(
            switchMap((newAssessment: SelfAssessmentMgm) => {
                if (newAssessment) {
                    // Check if there is no self assessment or if it has changed
                    if (!this.selfAssessment || this.selfAssessment.id !== newAssessment.id) {
                        this.selfAssessment = newAssessment;

                        switch (this.selfAssessment.impactMode) {
                            case ImpactMode.QUANTITATIVE: {
                                return this.fetchCriticalLevelAndAssetsAtRisk();
                            }
                            case ImpactMode.QUALITATIVE: {
                                return forkJoin(of(null), of([]));
                            }
                            default: {
                                return forkJoin(of(null), of([]));
                            }
                        }
                    }
                } else {
                    return forkJoin(of(null), of([]));
                }
            })
        ).subscribe(
            (response: [CriticalLevelMgm, MyAssetRisk[]]) => {
                if (response && response.length && response.length === 2) {
                    this.handleCriticalLevelAndAssetsAtRisk(response[0], response[1]);
                }
            },
            (error) => {
                this.loadingRiskLevel = false;
                this.loadingAssetsAndAttacks = false;
            }
        );
    }

    private extractAttackStatus() {
        if (this.riskBoardStatus.riskEvaluationStatus === Status.FULL) {
            this.attackCosts = true;
        } else {
            this.attackCosts = false;
        }
    }

    public whichLevel(row: number, column: number): string {
        return this.riskService.whichLevel(row, column, this.criticalLevel);
    }

    public whichCriticalContentByCell(row: number, column: number): string {
        if (this.bostonSquareCells.length >= row) {
            if (this.bostonSquareCells[row - 1] && this.bostonSquareCells[row - 1].length >= column) {
                return this.bostonSquareCells[row - 1][column - 1];
            }
        }
        let content = '';
        let fullContent = '';
        let criticalAsset = 0;
        if (this.myAssetsAtRisk.length === 0) {
            return content;
        }
        for (const myAsset of this.myAssetsAtRisk) {
            if (!myAsset.impact && !myAsset.risk) {
                continue;
            }
            if (column === myAsset.impact && Math.pow(row - 1, 2) < myAsset.critical && myAsset.critical <= Math.pow(row, 2)) {
                if (content.length === 0) {
                    content = myAsset.asset.name;
                } else {
                    criticalAsset++;
                }
                fullContent = fullContent.concat(myAsset.asset.name + ', ');
            }
        }
        content = content.trim();
        const key = row.toString() + column.toString();
        this.assetsToolTip.set(Number(key), fullContent.substr(0, fullContent.length - 2));
        if (!this.assetToolTipLoaded && !this.assetToolTipLoadedTimer) {
            this.assetToolTipLoadedTimer = true;
            setTimeout(() => {
                this.assetToolTipLoaded = true;
            }, 1000);
        }
        if (content.length > 0) {
            content = content.substr(0, 12);
            if (criticalAsset > 0) {
                content = content.concat(' +' + criticalAsset);
            }
        }
        if (!this.bostonSquareCells[row - 1]) {
            this.bostonSquareCells[row - 1] = [];
        }
        this.bostonSquareCells[row - 1][column - 1] = content;
        return content;
    }

    public concatenateAndParse(numbers: number[]): number {
        let mapIndex = '';
        for (const elem of numbers) {
            mapIndex = mapIndex.concat(elem.toString());
        }
        return Number(mapIndex);
    }

    private fetchCriticalLevelAndAssetsAtRisk(): Observable<[CriticalLevelMgm, MyAssetRisk[]]> {
        return forkJoin(
            this.riskService.getCriticalLevel(this.selfAssessment)
                .catch((error) => {
                    return of(null);
                }),
            this.riskService.getMyAssetsAtRisk(this.selfAssessment)
                .catch(
                    (error) => {
                        return of([]);
                    }
                )
        );
    }

    private handleCriticalLevelAndAssetsAtRisk(criticalLevel: CriticalLevelMgm, myAssetRisks: MyAssetRisk[]): void {
        if (criticalLevel) {
            this.criticalLevel = criticalLevel;
            this.squareColumnElement = [];
            this.squareRowElement = [];
            this.lastSquareRowElement = this.criticalLevel.side + 1;
            for (let i = 1; i <= this.criticalLevel.side; i++) {
                this.squareColumnElement.push(i);
                this.squareRowElement.push(i);
            }
            this.squareRowElement.push(this.criticalLevel.side + 1);
            this.loadingRiskLevel = false;
        } else {
            this.loadingRiskLevel = false;
        }

        if (myAssetRisks) {
            this.myAssetsAtRisk = myAssetRisks;
            this.loadingAssetsAndAttacks = false;
        } else {
            this.loadingAssetsAndAttacks = false;
        }
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            })
        }
    }
}
