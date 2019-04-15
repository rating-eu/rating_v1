import {Component, OnInit} from '@angular/core';
import {CriticalAttackStrategyService} from "../models/critical-attack-strategy.service";
import {SelfAssessmentMgm, SelfAssessmentMgmService} from "../../entities/self-assessment-mgm";
import {CriticalAttackStrategy} from "../models/critical-attack-strategy.model";
import * as _ from 'lodash';

export enum CriticalAttackStrategyField {
    'ATTACK_STRATEGY' = <any>'ATTACK_STRATEGY',
    'TARGET_ASSETS' = <any>'TARGET_ASSETS',
    'CRITICALITY' = <any>'CRITICALITY',
    'AWARENESS' = <any>'AWARENESS',
    'SOC' = <any>'SOC',
    'ALERT' = <any>'ALERT',
}

@Component({
    selector: 'jhi-most-critical-attack-strategies-widget',
    templateUrl: './most-critical-attack-strategies-widget.component.html',
    styleUrls: ['most-critical-attack-strategies-widget.component.css']
})
export class MostCriticalAttackStrategiesWidgetComponent implements OnInit {
    public isCollapsed = true;
    public loading = false;
    public casFieldEnum = CriticalAttackStrategyField;
    public showAttackInfo = new Map();

    /**
     * Map to keep the sorting status of the fields of the CriticalAttackStrategies.
     * The key is its field, while the value is a number,
     * equal to -1 if sorted in descending mode,
     * 0 if not sorted at all, and 1 if sorted in ascending mode.
     */
    public sortingStatusMap: Map<CriticalAttackStrategyField, number>;

    public attackStrategiesPaginator = {
        id: 'critical_attack_strategies_paginator',
        itemsPerPage: 7,
        currentPage: 1
    };

    private selfAssessment: SelfAssessmentMgm;
    public criticalAttackStrategies: CriticalAttackStrategy[];

    constructor(
        private selfAssessmentService: SelfAssessmentMgmService,
        private criticalAttackStrategyService: CriticalAttackStrategyService) {
    }

    ngOnInit() {
        this.selfAssessment = this.selfAssessmentService.getSelfAssessment();
        this.criticalAttackStrategyService.getCriticalAttackStrategies(this.selfAssessment.id).subscribe(
            (response: CriticalAttackStrategy[]) => {
                this.criticalAttackStrategies = response;
            }
        );

        this.sortingStatusMap = new Map();
    }

    onAttackStrategiesPageChange(number: number) {
        this.attackStrategiesPaginator.currentPage = number;
    }

    orderTableBy(field: CriticalAttackStrategyField, desc: boolean) {
        switch (field) {
            case CriticalAttackStrategyField.ATTACK_STRATEGY: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.attackStrategy.name, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.ATTACK_STRATEGY, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.attackStrategy.name, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.ATTACK_STRATEGY, 1);
                }

                break;
            }
            case CriticalAttackStrategyField.TARGET_ASSETS: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.targetAssets, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.TARGET_ASSETS, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.targetAssets, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.TARGET_ASSETS, 1);
                }

                break;
            }
            case CriticalAttackStrategyField.CRITICALITY: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.criticalityPercentage, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.CRITICALITY, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.criticalityPercentage, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.CRITICALITY, 1);
                }

                break;
            }
            case CriticalAttackStrategyField.AWARENESS: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.awarenessCriticalityPercentage, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.AWARENESS, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.awarenessCriticalityPercentage, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.AWARENESS, 1);
                }

                break;
            }
            case CriticalAttackStrategyField.SOC: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.socCriticalityPercentage, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.SOC, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.socCriticalityPercentage, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.SOC, 1);
                }

                break;
            }
            case CriticalAttackStrategyField.ALERT: {

                if (desc) {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.alertPercentage, ['desc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.ALERT, -1);
                } else {
                    this.criticalAttackStrategies = _.orderBy(this.criticalAttackStrategies, (item: CriticalAttackStrategy) => item.alertPercentage, ['asc']);
                    this.sortingStatusMap.set(CriticalAttackStrategyField.ALERT, 1);
                }

                break;
            }
        }
    }

    toggleInfo(attackStrategyID: number) {
        if (this.showAttackInfo.has(attackStrategyID)) {
            const status: boolean = this.showAttackInfo.get(attackStrategyID);

            this.showAttackInfo.set(attackStrategyID, !status);
        } else {
            this.showAttackInfo.set(attackStrategyID, true);
        }
    }
}
