import {Component, OnInit} from '@angular/core';
import {CriticalAttackStrategyService} from "../models/critical-attack-strategy.service";
import {SelfAssessmentMgm, SelfAssessmentMgmService} from "../../entities/self-assessment-mgm";
import {CriticalAttackStrategy} from "../models/critical-attack-strategy.model";

@Component({
    selector: 'jhi-most-critical-attack-strategies-widget',
    templateUrl: './most-critical-attack-strategies-widget.component.html',
    styleUrls: ['most-critical-attack-strategies-widget.component.css']
})
export class MostCriticalAttackStrategiesWidgetComponent implements OnInit {
    public isCollapsed = true;
    public loading = false;

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
        )
    }

    onAttackStrategiesPageChange(number: number) {
        this.attackStrategiesPaginator.currentPage = number;
    }
}
