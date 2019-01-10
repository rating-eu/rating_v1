import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { ResultsService } from '../results.service';
import { Result } from '../models/result.model';
import { HttpResponse } from '@angular/common/http';
import { ThreatAgentLikelihoods } from '../../utils/threatagent.likelihoods.class';
import { ThreatAgentMgm } from '../../entities/threat-agent-mgm';
import { Observable } from 'rxjs/Observable';
import { SelfAssessmentOverview } from '../../my-self-assessments/models/SelfAssessmentOverview.model';
import { AugmentedMyAsset } from '../../my-self-assessments/models/AugmentedMyAsset.model';
import { AugmentedAttackStrategy } from '../../evaluate-weakness/models/augmented-attack-strategy.model';

@Component({
    selector: 'jhi-results-overview',
    templateUrl: './results-overview.component.html',
    styleUrls: ['../results.css']
})
export class ResultsOverviewComponent implements OnInit {
    public page = 1;
    public assetAttacksNumbMap: Map<number, number> = new Map<number, number>();
    public assets: AugmentedMyAsset[];
    public selectedAsset: AugmentedMyAsset;
    public selectedAttacks: AugmentedAttackStrategy[];
    public loading = false;
    public loadingAttacksTable = false;
    selfAssessment: SelfAssessmentMgm;
    threatAgents: ThreatAgentMgm[];
    threatAgentsMap: Map<number, ThreatAgentMgm>;

    result: Result;
    result$: Observable<HttpResponse<Result>>;

    maxLikelihood: number;
    maxLikelihood$: Observable<number>;

    threatAgentLikelihoodsMap: Map<number/*ThreatAgent ID*/, ThreatAgentLikelihoods>;
    threatAgentIDs: number[];

    maxVulnerability: number = Number.NEGATIVE_INFINITY;

    // SelfAssessment overview
    public overview: SelfAssessmentOverview;

    constructor(private selfAssessmentService: SelfAssessmentMgmService,
        private resultService: ResultsService) {
    }

    ngOnInit() {
        this.selfAssessment = this.selfAssessmentService.getSelfAssessment();
        this.threatAgents = this.selfAssessment.threatagents;
        this.threatAgentsMap = new Map<number, ThreatAgentMgm>();
        this.threatAgents.forEach((value: ThreatAgentMgm) => {
            this.threatAgentsMap.set(value.id, value);
        });

        this.threatAgentLikelihoodsMap = new Map<number/*ThreatAgentID*/, ThreatAgentLikelihoods>();

        this.maxLikelihood$ = this.resultService.getMax();

        this.result$ = this.maxLikelihood$.mergeMap(
            (value: number) => {
                this.maxLikelihood = value;

                return this.resultService.getResult(this.selfAssessment.id);
            }
        );

        this.result$.subscribe(
            (response: HttpResponse<Result>) => {
                this.result = response.body;
                const initialVulnerabilityMap: Map<number, number> = this.result.initialVulnerability as Map<number, number>;
                const contextualVulnerabilityMap: Map<number/*ThreatAgentID*/, number> = this.result.contextualVulnerability as Map<number, number>;
                const refinedVulnerabilityMap: Map<number, number> = this.result.refinedVulnerability as Map<number, number>;

                // Initial Likelihood
                initialVulnerabilityMap.forEach((value: number, threatAgentID: number) => {
                    if (this.threatAgentLikelihoodsMap.has(threatAgentID)) {
                        const likelihood: ThreatAgentLikelihoods = this.threatAgentLikelihoodsMap.get(threatAgentID);
                        likelihood.initialLikelihood = (value / this.maxLikelihood);
                    } else {
                        const likelihood: ThreatAgentLikelihoods = new ThreatAgentLikelihoods(this.threatAgentsMap.get(threatAgentID));
                        likelihood.initialLikelihood = (value / this.maxLikelihood);
                        this.threatAgentLikelihoodsMap.set(threatAgentID, likelihood);
                    }

                    // Update the max
                    if ((value / this.maxLikelihood) > this.maxVulnerability) {
                        this.maxVulnerability = (value / this.maxLikelihood);
                    }
                });

                // Contextual Likelihood
                if (contextualVulnerabilityMap.size > 0) {
                    this.maxVulnerability = Number.NEGATIVE_INFINITY;
                }

                contextualVulnerabilityMap.forEach((value: number, threatAgentID: number) => {
                    if (this.threatAgentLikelihoodsMap.has(threatAgentID)) {
                        const likelihood: ThreatAgentLikelihoods = this.threatAgentLikelihoodsMap.get(threatAgentID);
                        likelihood.contextualLikelihood = (value / this.maxLikelihood);
                    } else {
                        const likelihood: ThreatAgentLikelihoods = new ThreatAgentLikelihoods(this.threatAgentsMap.get(threatAgentID));
                        likelihood.contextualLikelihood = (value / this.maxLikelihood);
                        this.threatAgentLikelihoodsMap.set(threatAgentID, likelihood);
                    }

                    // Update the max
                    if ((value / this.maxLikelihood) > this.maxVulnerability) {
                        this.maxVulnerability = (value / this.maxLikelihood);
                    }
                });

                // Refined Likelihood
                if (refinedVulnerabilityMap.size > 0) {
                    this.maxVulnerability = Number.NEGATIVE_INFINITY;
                }

                refinedVulnerabilityMap.forEach((value: number, threatAgentID: number) => {
                    if (this.threatAgentLikelihoodsMap.has(threatAgentID)) {
                        const likelihood: ThreatAgentLikelihoods = this.threatAgentLikelihoodsMap.get(threatAgentID);
                        likelihood.refinedLikelihood = (value / this.maxLikelihood);
                    } else {
                        const likelihood: ThreatAgentLikelihoods = new ThreatAgentLikelihoods(this.threatAgentsMap.get(threatAgentID));
                        likelihood.refinedLikelihood = (value / this.maxLikelihood);
                        this.threatAgentLikelihoodsMap.set(threatAgentID, likelihood);
                    }

                    // Update the max
                    if ((value / this.maxLikelihood) > this.maxVulnerability) {
                        this.maxVulnerability = (value / this.maxLikelihood);
                    }
                });

                this.threatAgentIDs = [];
                this.threatAgentLikelihoodsMap.forEach((value: ThreatAgentLikelihoods, key: number) => {
                    this.threatAgentIDs.push(key);
                });
            }
        );
        this.selfAssessmentService.getOverwiew().toPromise().then((res: SelfAssessmentOverview) => {
            if (res) {
                this.loading = true;
                this.overview = res;
                this.assets = [];
                for (const item of this.overview.augmentedMyAssets) {
                    if (this.assetAttacksNumbMap.has(item.asset.id)) {
                        this.assetAttacksNumbMap.set(
                            item.asset.id,
                            this.assetAttacksNumbMap.get(item.asset.id) + 1
                        );
                    } else {
                        this.assetAttacksNumbMap.set(item.asset.id, 1);
                        this.assets.push(item);
                    }
                }
                this.loading = false;
            }
        });
    }

    public selectAsset(asset: AugmentedMyAsset) {
        if (this.selectedAsset) {
            if (this.selectedAsset.asset.id === asset.asset.id) {
                this.selectedAsset = null;
                return;
            }
        }
        this.selectedAsset = asset;
        this.selectedAttacks = [];
        this.loadingAttacksTable = true;
        for (const item of this.overview.augmentedMyAssets) {
            if (item.asset.id === this.selectedAsset.asset.id) {
                this.selectedAttacks.push(item.augmentedAttackStrategy);
            }
        }
        this.loadingAttacksTable = false;
    }
}
