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
import {RiskBoardService, RiskBoardStatus} from '../../risk-board/risk-board.service';
import * as _ from 'lodash';

import {Component, OnDestroy, OnInit} from '@angular/core';
import {AugmentedAttackStrategy} from '../../evaluate-weakness/models/augmented-attack-strategy.model';
import {Observable, Subscription} from 'rxjs';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {ThreatAgentMgm, ThreatAgentMgmService} from '../../entities/threat-agent-mgm';
import {HttpResponse} from '@angular/common/http';
import {PhaseMgm, PhaseMgmService} from '../../entities/phase-mgm';
import {LevelMgm, LevelMgmService} from '../../entities/level-mgm';
import {AttackStrategyMgm} from '../../entities/attack-strategy-mgm';
import {LikelihoodStep} from '../../entities/enumerations/LikelihoodStep.enum';
import {AttackMapService} from '../../evaluate-weakness/attack-map.service';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {WeaknessUtils} from '../../evaluate-weakness/utils/weakness-utils';
import {MatHorizontalStepper} from '@angular/material';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";

@Component({
    selector: 'jhi-attack-map-widget',
    templateUrl: './attack-map-widget.component.html',
    styleUrls: ['attack-map-widget.component.css']
})

export class AttackMapWidgetComponent implements OnInit, OnDestroy {
    public loading = false;
    public isCollapsed = true;
    public isViewDivDetailsVisible = false;
    public datailParam: number;
    private selectedAugmentedAttackStrategy: AugmentedAttackStrategy = null;

    private _subscriptions: Subscription[] = [];
    public debug = false;

    private myCompany: MyCompanyMgm;

    // ThreatAgents
    public threatAgents: ThreatAgentMgm[];
    public threatAgents$: Observable<HttpResponse<ThreatAgentMgm[]>>;
    public selectedThreatAgent: ThreatAgentMgm;

    // CyberKillChain7 Phases
    public ckc7Phases$: Observable<HttpResponse<PhaseMgm[]>>;
    public ckc7Phases: PhaseMgm[];

    // Attack Levels
    public attackLevels$: Observable<HttpResponse<LevelMgm[]>>;
    public attackLevels: LevelMgm[];

    // AttackStrategies
    public attackStrategies$: Observable<HttpResponse<AttackStrategyMgm[]>>;
    public attackStrategies: AttackStrategyMgm[];
    /**
     * Map used to update the likelihoods of each AttackStrategy in time O(1).
     */
    public augmentedAttackStrategiesMap: Map<number/*AttackStrategy ID*/, AugmentedAttackStrategy/*AttackStrategy likelihoods*/>;

    public attackMatrix$: Observable<Map<Number, Map<Number, AugmentedAttackStrategy>>>;

    // Attack Plan Matrix
    public attacksCKC7Matrix: Map<Number, Map<Number, AugmentedAttackStrategy>>;

    // Likelihood Steps
    public likelihoodStep: LikelihoodStep = LikelihoodStep.INITIAL_LIKELIHOOD;
    public likelihoodStepEnum = LikelihoodStep;
    public likelihoodStepEnabled: Map<number/*Step-Number*/, boolean>;

    constructor(
        private levelService: LevelMgmService,
        private phaseService: PhaseMgmService,
        private attackMapService: AttackMapService,
        private dashService: RiskBoardService,
        private dataSharingService: DatasharingService,
        private threatAgentService: ThreatAgentMgmService
    ) {
    }

    ngOnInit() {
        this.loading = true;
        this.likelihoodStepEnabled = new Map();
        this.likelihoodStepEnabled.set(LikelihoodStep.INITIAL_LIKELIHOOD, false);
        this.likelihoodStepEnabled.set(LikelihoodStep.CONTEXTUAL_LIKELIHOOD, false);
        this.likelihoodStepEnabled.set(LikelihoodStep.REFINED_LIKELIHOOD, false);

        this.myCompany = this.dataSharingService.myCompany;
        this.callAPI();

        this.dataSharingService.myCompanyObservable.subscribe((response: MyCompanyMgm) => {
            this.myCompany = response;
            this.callAPI();
        });
    }

    private callAPI() {
        if (this.myCompany && this.myCompany.companyProfile) {
            this.threatAgents$ = this.threatAgentService.getThreatAgentsByCompany(this.myCompany.companyProfile.id);
            this.ckc7Phases$ = this.phaseService.query();
            this.attackLevels$ = this.levelService.query();
            this.attackMatrix$ = this.attackMapService.getAttackCKC7Matrix(this.myCompany.companyProfile);

            const join$: Observable<[HttpResponse<PhaseMgm[]>, HttpResponse<LevelMgm[]>, Map<Number, Map<Number, AugmentedAttackStrategy>>, HttpResponse<ThreatAgentMgm[]>]> =
                forkJoin(this.ckc7Phases$, this.attackLevels$, this.attackMatrix$, this.threatAgents$);

            join$.subscribe((response: [HttpResponse<PhaseMgm[]>, HttpResponse<LevelMgm[]>, Map<Number, Map<Number, AugmentedAttackStrategy>>, HttpResponse<ThreatAgentMgm[]>]) => {
                    this.ckc7Phases = response[0].body;
                    // Remove id 7 phase
                    const index = _.findIndex(this.ckc7Phases, (phase) => phase.id === 7);

                    if (index !== -1) {
                        this.ckc7Phases.splice(index, 1);
                    }

                    this.attackLevels = response[1].body;
                    this.attacksCKC7Matrix = response[2];
                    this.threatAgents = response[3].body;

                    this.augmentedAttackStrategiesMap = new Map<number, AugmentedAttackStrategy>();

                    // Make same ID AttackStrategies point to the same AugmentedAttackStrategy object
                    for (const levelID of Object.keys(this.attacksCKC7Matrix)) {
                        for (const phaseID of Object.keys(this.attacksCKC7Matrix[levelID])) {
                            const augmentedAttackStrategies: Array<AugmentedAttackStrategy> = this.attacksCKC7Matrix[Number(levelID)][Number(phaseID)];
                            const augmentedAttackStrategiesByReference: Array<AugmentedAttackStrategy> = [];

                            for (let augmentedAttackStrategy of augmentedAttackStrategies) {
                                if (!this.augmentedAttackStrategiesMap.has(augmentedAttackStrategy.id)) {
                                    this.augmentedAttackStrategiesMap.set(augmentedAttackStrategy.id, augmentedAttackStrategy);

                                    // Each time that we encounter an AttackStrategy we put it in the array by Reference
                                    augmentedAttackStrategiesByReference.push(augmentedAttackStrategy);
                                } else {
                                    augmentedAttackStrategy = this.augmentedAttackStrategiesMap.get(augmentedAttackStrategy.id);
                                    // Each time that we encounter an AttackStrategy we put it in the array by Reference
                                    augmentedAttackStrategiesByReference.push(augmentedAttackStrategy);
                                }
                            }
                            // Finally we replace the initial AttackStrategies with those by REFERENCE
                            // (to allow one-time update for all the occurrences of the same AttackStrategy in different Levels or Phases)
                            this.attacksCKC7Matrix[Number(levelID)][Number(phaseID)] = augmentedAttackStrategiesByReference;
                        }
                    }
                    // Check which steps (INITIAL, CONTEXTUAL, REFINED) are available.
                    const allAugmentedAttackStrategies: AugmentedAttackStrategy[] = Array.from(this.augmentedAttackStrategiesMap.values());

                    if (allAugmentedAttackStrategies && allAugmentedAttackStrategies.length > 0) {
                        const augmentedAttackStrategy: AugmentedAttackStrategy = allAugmentedAttackStrategies[0];
                        if (augmentedAttackStrategy.initialLikelihood > 0) {
                            this.likelihoodStepEnabled.set(LikelihoodStep.INITIAL_LIKELIHOOD, true);
                        }
                        if (augmentedAttackStrategy.contextualLikelihood > 0) {
                            this.likelihoodStepEnabled.set(LikelihoodStep.CONTEXTUAL_LIKELIHOOD, true);
                        }
                        if (augmentedAttackStrategy.refinedLikelihood > 0) {
                            this.likelihoodStepEnabled.set(LikelihoodStep.REFINED_LIKELIHOOD, true);
                        }
                    }

                    // Set the SelectedThreatAgent (NULL) to make sure all the AttackStrategies are disabled at start.
                    this.threatAgentChanged(this.selectedThreatAgent);
                    this.loading = false;
                },
                (error: any) => {
                    this.loading = false;
                });
        }
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((subscription: Subscription) => {
            if (subscription) {
                subscription.unsubscribe();
            }
        });
    }

    viewDivDetails(id: number) {
        this.datailParam = id;
        this.isViewDivDetailsVisible = true;
        setTimeout(() => {
            document.getElementById('details').scrollIntoView();
        }, 250);
    }

    threatAgentChanged(threatAgent: ThreatAgentMgm) {
        WeaknessUtils.threatAgentChanged(threatAgent, this.augmentedAttackStrategiesMap);
    }

    likelihoodStepChange($event: MatHorizontalStepper) {
        const stepNumber: number = $event.selectedIndex;
        const stepName: string = LikelihoodStep[stepNumber];
        this.likelihoodStep = LikelihoodStep[stepName];
    }

    selectAttackStrategy(augmentedAttackStrategy: AugmentedAttackStrategy) {
        this.selectedAugmentedAttackStrategy = augmentedAttackStrategy;
    }
}
