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
import {ThreatAgentMgm} from '../../entities/threat-agent-mgm';
import {AugmentedAttackStrategy} from '../models/augmented-attack-strategy.model';
import {WeaknessUtils} from '../utils/weakness-utils';
import {AttackMapService} from '../attack-map.service';
import {MatHorizontalStepper} from '@angular/material';
import {LikelihoodStep} from '../../entities/enumerations/LikelihoodStep.enum';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styleUrls: [
        '.././evaluate-weakness.css'
    ]
})
export class WeaknessResultComponent implements OnInit, OnDestroy {
    private _subscriptions: Subscription[] = [];
    debug = false;

    selfAssessment: SelfAssessmentMgm;

    // ThreatAgents
    threatAgents: ThreatAgentMgm[];
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

    //Likelihood Steps
    likelihoodStep: LikelihoodStep = LikelihoodStep.INITIAL_LIKELIHOOD;
    likelihoodStepEnum = LikelihoodStep;

    constructor(private route: ActivatedRoute,
                private selfAssessmentService: SelfAssessmentMgmService,
                private questionnaireStatusService: QuestionnaireStatusMgmService,
                private levelService: LevelMgmService,
                private phaseService: PhaseMgmService,
                private attackStrategyService: AttackStrategyMgmService,
                private attackMapService: AttackMapService) {
    }

    ngOnInit() {
        this.selfAssessment = this.selfAssessmentService.getSelfAssessment();
        this.threatAgents = this.selfAssessment.threatagents;

        this.ckc7Phases$ = this.phaseService.query();
        this.attackLevels$ = this.levelService.query();
        this.attackMatrix$ = this.attackMapService.getAttackCKC7Matrix(this.selfAssessment.id);

        const join$: Observable<[HttpResponse<PhaseMgm[]>, HttpResponse<LevelMgm[]>, Map<Number, Map<Number, AugmentedAttackStrategy>>]> =
            forkJoin(this.ckc7Phases$, this.attackLevels$, this.attackMatrix$);

        join$.subscribe((response: [HttpResponse<PhaseMgm[]>, HttpResponse<LevelMgm[]>, Map<Number, Map<Number, AugmentedAttackStrategy>>]) => {
            this.ckc7Phases = response[0].body;
            this.attackLevels = response[1].body;
            this.attacksCKC7Matrix = response[2];

            this.augmentedAttackStrategiesMap = new Map<number, AugmentedAttackStrategy>();

            //Make same ID AttackStrategies point to the same AugmentedAttackStrategy object
            for (const levelID of Object.keys(this.attacksCKC7Matrix)) {
                console.log('LevelID: ' + levelID);

                for (const phaseID of Object.keys(this.attacksCKC7Matrix[levelID])) {
                    console.log('PhaseID: ' + phaseID);

                    const augmentedAttackStrategies: Array<AugmentedAttackStrategy> = this.attacksCKC7Matrix[Number(levelID)][Number(phaseID)];
                    const augmentedAttackStrategiesByReference: Array<AugmentedAttackStrategy> = [];

                    for (var augmentedAttackStrategy of augmentedAttackStrategies) {
                        if (!this.augmentedAttackStrategiesMap.has(augmentedAttackStrategy.id)) {
                            this.augmentedAttackStrategiesMap.set(augmentedAttackStrategy.id, augmentedAttackStrategy);

                            //Each time that we encounter an AttackStrategy we put it in the array by Reference
                            augmentedAttackStrategiesByReference.push(augmentedAttackStrategy);
                        } else {
                            augmentedAttackStrategy = this.augmentedAttackStrategiesMap.get(augmentedAttackStrategy.id);
                            //Each time that we encounter an AttackStrategy we put it in the array by Reference
                            augmentedAttackStrategiesByReference.push(augmentedAttackStrategy);
                        }
                    }

                    //Finally we replace the initial AttackStrategies with those by REFERENCE
                    //(to allow one-time update for all the occurrences of the same AttackStrategy in different Levels or Phases)
                    this.attacksCKC7Matrix[Number(levelID)][Number(phaseID)] = augmentedAttackStrategiesByReference;
                }
            }

            //Set the SelectedThreatAgent (NULL) to make sure all the AttackStrategies are disabled at start.
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
        console.log('Likelihood Step Change...');
        console.log('SelectedIndex: ' + $event.selectedIndex);

        const stepNumber: number = $event.selectedIndex;
        const stepName: string = LikelihoodStep[stepNumber];
        this.likelihoodStep = LikelihoodStep[stepName];

        console.log('Likelihood Step: ' + this.likelihoodStep);
    }
}
