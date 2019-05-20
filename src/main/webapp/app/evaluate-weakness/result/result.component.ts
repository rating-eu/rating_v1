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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {QuestionnaireStatusMgmService} from '../../entities/questionnaire-status-mgm';
import {HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {PhaseMgm, PhaseMgmService} from '../../entities/phase-mgm';
import {LevelMgm, LevelMgmService} from '../../entities/level-mgm';
import {AttackStrategyMgm} from '../../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import {AttackStrategyMgmService} from '../../entities/attack-strategy-mgm/attack-strategy-mgm.service';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {ThreatAgentMgm, ThreatAgentMgmService} from '../../entities/threat-agent-mgm';
import {AugmentedAttackStrategy} from '../models/augmented-attack-strategy.model';
import {WeaknessUtils} from '../utils/weakness-utils';
import {AttackMapService} from '../attack-map.service';
import {MatHorizontalStepper} from '@angular/material';
import {LikelihoodStep} from '../../entities/enumerations/LikelihoodStep.enum';
import * as _ from 'lodash';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styleUrls: [
        '.././evaluate-weakness.css'
    ]
})
export class WeaknessResultComponent implements OnInit, OnDestroy {
    public isViewDivDetailsVisible = false;
    public datailParam: number;
    private selectedAugmentedAttackStrategy: AugmentedAttackStrategy = null;

    private _subscriptions: Subscription[] = [];
    debug = false;

    selfAssessment: SelfAssessmentMgm = null;
    myCompany: MyCompanyMgm = null;

    // ThreatAgents
    threatAgents: ThreatAgentMgm[];
    threatAgents$: Observable<HttpResponse<ThreatAgentMgm[]>>;
    selectedThreatAgent: ThreatAgentMgm;

    // CyberKillChain7 Phases
    ckc7Phases$: Observable<HttpResponse<PhaseMgm[]>>;
    ckc7Phases: PhaseMgm[];

    // Attack Levels
    attackLevels$: Observable<HttpResponse<LevelMgm[]>>;
    attackLevels: LevelMgm[];

    // AttackStrategies
    attackStrategies$: Observable<HttpResponse<AttackStrategyMgm[]>>;
    attackStrategies: AttackStrategyMgm[];
    /**
     * Map used to update the likelihoods of each AttackStrategy in time O(1).
     */
    augmentedAttackStrategiesMap: Map<number/*AttackStrategy ID*/, AugmentedAttackStrategy/*AttackStrategy likelihoods*/>;

    attackMatrix$: Observable<Map<Number, Map<Number, AugmentedAttackStrategy>>>;

    // Attack Plan Matrix
    attacksCKC7Matrix: Map<Number, Map<Number, AugmentedAttackStrategy>>;

    // Likelihood Steps
    likelihoodStep: LikelihoodStep = LikelihoodStep.INITIAL_LIKELIHOOD;
    likelihoodStepEnum = LikelihoodStep;

    likelihoodStepEnabled: Map<number/*Step-Number*/, boolean>;

    constructor(private route: ActivatedRoute,
                private selfAssessmentService: SelfAssessmentMgmService,
                private questionnaireStatusService: QuestionnaireStatusMgmService,
                private levelService: LevelMgmService,
                private phaseService: PhaseMgmService,
                private attackStrategyService: AttackStrategyMgmService,
                private attackMapService: AttackMapService,
                private dataSharingService: DatasharingService,
                private threatAgentService: ThreatAgentMgmService) {
    }

    ngOnInit() {
        this.likelihoodStepEnabled = new Map();
        this.likelihoodStepEnabled.set(LikelihoodStep.INITIAL_LIKELIHOOD, false);
        this.likelihoodStepEnabled.set(LikelihoodStep.CONTEXTUAL_LIKELIHOOD, false);
        this.likelihoodStepEnabled.set(LikelihoodStep.REFINED_LIKELIHOOD, false);

        this.selfAssessment = this.dataSharingService.selfAssessment;
        this.myCompany = this.dataSharingService.myCompany;

        this.threatAgents$ = this.threatAgentService.getThreatAgentsByCompany(this.myCompany.companyProfile.id);
        this.ckc7Phases$ = this.phaseService.query();
        this.attackLevels$ = this.levelService.query();
        this.attackMatrix$ = this.attackMapService.getAttackCKC7Matrix(this.myCompany.companyProfile);

        const join$: Observable<[HttpResponse<ThreatAgentMgm[]>, HttpResponse<PhaseMgm[]>, HttpResponse<LevelMgm[]>, Map<Number, Map<Number, AugmentedAttackStrategy>>]> =
            forkJoin(this.threatAgents$, this.ckc7Phases$, this.attackLevels$, this.attackMatrix$);

        join$.subscribe((response: [HttpResponse<ThreatAgentMgm[]>, HttpResponse<PhaseMgm[]>, HttpResponse<LevelMgm[]>, Map<Number, Map<Number, AugmentedAttackStrategy>>]) => {
            this.threatAgents = response[0].body;

            this.ckc7Phases = response[1].body;
            // Remove id 7 phase
            const index = _.findIndex(this.ckc7Phases, (phase) => phase.id === 7);

            if (index !== -1) {
                this.ckc7Phases.splice(index, 1);
            }

            this.attackLevels = response[2].body;
            this.attacksCKC7Matrix = response[3];

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
        });
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
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

    viewDivDetails(id: number) {
        this.datailParam = id;
        this.isViewDivDetailsVisible = true;
        setTimeout(() => {
            document.getElementById('details').scrollIntoView();
        }, 250);
    }
}
