import * as _ from 'lodash';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AugmentedAttackStrategy } from '../../evaluate-weakness/models/augmented-attack-strategy.model';
import { Subscription, Observable } from 'rxjs';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { ThreatAgentMgm } from '../../entities/threat-agent-mgm';
import { HttpResponse } from '@angular/common/http';
import { PhaseMgm, PhaseMgmService } from '../../entities/phase-mgm';
import { LevelMgm, LevelMgmService } from '../../entities/level-mgm';
import { AttackStrategyMgm } from '../../entities/attack-strategy-mgm';
import { LikelihoodStep } from '../../entities/enumerations/LikelihoodStep.enum';
import { AttackMapService } from '../../evaluate-weakness/attack-map.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { WeaknessUtils } from '../../evaluate-weakness/utils/weakness-utils';
import { MatHorizontalStepper } from '@angular/material';

@Component({
  selector: 'jhi-attack-map-widget',
  templateUrl: './attack-map-widget.component.html',
  styleUrls: ['attack-map-widget.component.css']
})

export class AttackMapWidgetComponent implements OnInit, OnDestroy {
  public loading = false;
  public isCollapsed = false;
  viewDetails = false;
  private selectedAugmentedAttackStrategy: AugmentedAttackStrategy = null;

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

  // Likelihood Steps
  likelihoodStep: LikelihoodStep = LikelihoodStep.INITIAL_LIKELIHOOD;
  likelihoodStepEnum = LikelihoodStep;

  constructor(
    private selfAssessmentService: SelfAssessmentMgmService,
    private levelService: LevelMgmService,
    private phaseService: PhaseMgmService,
    private attackMapService: AttackMapService) {
  }

  ngOnInit() {
    this.loading = true;
    this.selfAssessment = this.selfAssessmentService.getSelfAssessment();
    this.threatAgents = this.selfAssessment.threatagents;

    this.ckc7Phases$ = this.phaseService.query();
    this.attackLevels$ = this.levelService.query();
    this.attackMatrix$ = this.attackMapService.getAttackCKC7Matrix(this.selfAssessment.id);

    const join$: Observable<[HttpResponse<PhaseMgm[]>, HttpResponse<LevelMgm[]>, Map<Number, Map<Number, AugmentedAttackStrategy>>]> =
      forkJoin(this.ckc7Phases$, this.attackLevels$, this.attackMatrix$);

    join$.subscribe((response: [HttpResponse<PhaseMgm[]>, HttpResponse<LevelMgm[]>, Map<Number, Map<Number, AugmentedAttackStrategy>>]) => {
      this.ckc7Phases = response[0].body;
      // Remove id 7 phase
      const index = _.findIndex(this.ckc7Phases, (phase) => phase.id === 7);

      if (index !== -1) {
        this.ckc7Phases.splice(index, 1);
      }

      this.attackLevels = response[1].body;
      this.attacksCKC7Matrix = response[2];

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

      // Set the SelectedThreatAgent (NULL) to make sure all the AttackStrategies are disabled at start.
      this.threatAgentChanged(this.selectedThreatAgent);
      this.loading = false;
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

  showDetails() {
    if (this.selectedAugmentedAttackStrategy) {
      this.viewDetails = true;
    } else {
      this.viewDetails = false;
    }
  }

  hideDetails() {
    this.selectAttackStrategy(null);
    this.viewDetails = false;
  }
}