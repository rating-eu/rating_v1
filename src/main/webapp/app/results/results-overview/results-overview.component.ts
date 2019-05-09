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

import {Component, OnInit} from '@angular/core';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {ResultsService} from '../results.service';
import {Result} from '../models/result.model';
import {HttpResponse} from '@angular/common/http';
import {ThreatAgentLikelihoods} from '../../utils/threatagent.likelihoods.class';
import {ThreatAgentMgm, ThreatAgentMgmService} from '../../entities/threat-agent-mgm';
import {Observable} from 'rxjs/Observable';
import {SelfAssessmentOverview} from "../../my-risk-assessments/models/SelfAssessmentOverview.model";
import {AugmentedMyAsset} from "../../my-risk-assessments/models/AugmentedMyAsset.model";
import {AugmentedAttackStrategy} from '../../evaluate-weakness/models/augmented-attack-strategy.model';
import {Couple} from '../../utils/couple.class';
import * as _ from 'lodash';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {forkJoin} from "rxjs/observable/forkJoin";

interface OrderBy {
    asset: boolean;
    type: string;
}

@Component({
    selector: 'jhi-results-overview',
    templateUrl: './results-overview.component.html',
    styleUrls: ['../results.css']
})
export class ResultsOverviewComponent implements OnInit {
    public readonly THREAT_AGENT_NAME = 'name';
    public readonly INITIAL_LIKELIHOOD = 'initial';
    public readonly CONTEXTUAL_LIKELIHOOD = 'contextual';
    public readonly REFINED_LIKELIHOOD = 'refined';

    public page = 1;
    public assetAttacksNumbMap: Map<number, number> = new Map<number, number>();
    public assets: AugmentedMyAsset[];
    public tangibleAssets: AugmentedMyAsset[];
    public intangibleAssets: AugmentedMyAsset[];
    public selectedAsset: AugmentedMyAsset;
    public selectedAttacks: AugmentedAttackStrategy[];
    public loading = false;
    public loadingAttacksTable = false;

    selfAssessment: SelfAssessmentMgm;
    myCompany: MyCompanyMgm;

    threatAgents: ThreatAgentMgm[];
    threatAgents$: Observable<HttpResponse<ThreatAgentMgm[]>>;

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

    // Sorting
    public sortedBy: Map<string, Couple<boolean/*sorted*/, boolean/*ascending*/>>;

    public orderIntangibleBy: OrderBy;
    public orderTangibleBy: OrderBy;

    constructor(private selfAssessmentService: SelfAssessmentMgmService,
                private resultService: ResultsService,
                private dataSharingService: DatasharingService,
                private threatAgentService: ThreatAgentMgmService) {
    }

    ngOnInit() {
        this.sortedBy = new Map();
        this.orderTangibleBy = {
            asset: false,
            type: 'desc'
        };
        this.orderIntangibleBy = {
            asset: false,
            type: 'desc'
        };

        this.selfAssessment = this.dataSharingService.selfAssessment;
        this.myCompany = this.dataSharingService.myCompany;

        this.threatAgentLikelihoodsMap = new Map<number/*ThreatAgentID*/, ThreatAgentLikelihoods>();

        this.maxLikelihood$ = this.resultService.getMax();
        this.threatAgents$ = this.threatAgentService.getThreatAgentsByCompany(this.myCompany.id);

        const join$: Observable<[number, HttpResponse<ThreatAgentMgm[]>]> = forkJoin(this.maxLikelihood$, this.threatAgents$);

        this.result$ = join$.mergeMap(
            (value: [number, HttpResponse<ThreatAgentMgm[]>]) => {
                this.maxLikelihood = value[0];
                this.threatAgents = value[1].body;

                this.threatAgentsMap = new Map<number, ThreatAgentMgm>();

                if (this.threatAgents) {
                    this.threatAgents.forEach((value: ThreatAgentMgm) => {
                        this.threatAgentsMap.set(value.id, value);
                    });
                }

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
                this.tangibleAssets = [];
                this.intangibleAssets = [];
                for (const item of this.overview.augmentedMyAssets) {
                    if (this.assetAttacksNumbMap.has(item.asset.id)) {
                        this.assetAttacksNumbMap.set(
                            item.asset.id,
                            this.assetAttacksNumbMap.get(item.asset.id) + 1
                        );
                    } else {
                        this.assetAttacksNumbMap.set(item.asset.id, 1);
                        this.assets.push(item);
                        if (item.asset.assetcategory.type.toString() === 'TANGIBLE') {
                            this.tangibleAssets.push(item);
                        } else {
                            this.intangibleAssets.push(item);
                        }
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

    public sortTableBy(orderColumn: string, asc: boolean) {

        switch (orderColumn) {
            case this.THREAT_AGENT_NAME: {
                if (asc) {
                    this.threatAgentIDs = _.orderBy(this.threatAgentIDs, (threatAgentID: number) => this.threatAgentsMap.get(threatAgentID).name, ['asc']);
                } else {
                    this.threatAgentIDs = _.orderBy(this.threatAgentIDs, (threatAgentID: number) => this.threatAgentsMap.get(threatAgentID).name, ['desc']);
                }

                this.sortedBy.set(this.THREAT_AGENT_NAME, new Couple(true, asc));
                break;
            }
            case this.INITIAL_LIKELIHOOD: {
                if (asc) {
                    this.threatAgentIDs = _.orderBy(this.threatAgentIDs, (threatAgentID: number) => this.threatAgentLikelihoodsMap.get(threatAgentID).initialLikelihood, ['asc']);
                } else {
                    this.threatAgentIDs = _.orderBy(this.threatAgentIDs, (threatAgentID: number) => this.threatAgentLikelihoodsMap.get(threatAgentID).initialLikelihood, ['desc']);
                }

                this.sortedBy.set(this.INITIAL_LIKELIHOOD, new Couple(true, asc));
                break;
            }
            case this.CONTEXTUAL_LIKELIHOOD: {
                if (asc) {
                    this.threatAgentIDs = _.orderBy(
                        this.threatAgentIDs,
                        (threatAgentID: number) => this.threatAgentLikelihoodsMap.get(threatAgentID).contextualLikelihood,
                        ['asc']);
                } else {
                    this.threatAgentIDs = _.orderBy(
                        this.threatAgentIDs,
                        (threatAgentID: number) => this.threatAgentLikelihoodsMap.get(threatAgentID).contextualLikelihood,
                        ['desc']);
                }

                this.sortedBy.set(this.CONTEXTUAL_LIKELIHOOD, new Couple(true, asc));
                break;
            }
            case this.REFINED_LIKELIHOOD: {
                if (asc) {
                    this.threatAgentIDs = _.orderBy(this.threatAgentIDs, (threatAgentID: number) => this.threatAgentLikelihoodsMap.get(threatAgentID).refinedLikelihood, ['asc']);
                } else {
                    this.threatAgentIDs = _.orderBy(this.threatAgentIDs, (threatAgentID: number) => this.threatAgentLikelihoodsMap.get(threatAgentID).refinedLikelihood, ['desc']);
                }

                this.sortedBy.set(this.REFINED_LIKELIHOOD, new Couple(true, asc));
                break;
            }
        }
    }

    private resetOrder(witchCategory: string) {
        if (witchCategory === 'TANGIBLE') {
            this.orderTangibleBy.asset = false;
            this.orderTangibleBy.type = 'desc';
        } else {
            this.orderIntangibleBy.asset = false;
            this.orderIntangibleBy.type = 'desc';
        }
    }

    public tableOrderBy(orderColumn: string, category: string, desc: boolean) {
        if (category === 'TANGIBLE') {
            this.resetOrder('TANGIBLE');
            if (desc) {
                this.orderTangibleBy.type = 'desc';
            } else {
                this.orderTangibleBy.type = 'asc';
            }
            switch (orderColumn.toLowerCase()) {
                case ('asset'): {
                    this.orderTangibleBy.asset = true;
                    if (desc) {
                        this.tangibleAssets = _.orderBy(this.tangibleAssets, (elem: AugmentedMyAsset) => elem.asset.name, ['desc']);
                    } else {
                        this.tangibleAssets = _.orderBy(this.tangibleAssets, (elem: AugmentedMyAsset) => elem.asset.name, ['asc']);
                    }
                    break;
                }
            }
        } else {
            this.resetOrder('INTANGIBLE');
            if (desc) {
                this.orderIntangibleBy.type = 'desc';
            } else {
                this.orderIntangibleBy.type = 'asc';
            }
            switch (orderColumn.toLowerCase()) {
                case ('asset'): {
                    this.orderIntangibleBy.asset = true;
                    if (desc) {
                        this.intangibleAssets = _.orderBy(this.intangibleAssets, (elem: AugmentedMyAsset) => elem.asset.name, ['desc']);
                    } else {
                        this.intangibleAssets = _.orderBy(this.intangibleAssets, (elem: AugmentedMyAsset) => elem.asset.name, ['asc']);
                    }
                    break;
                }
            }
        }
    }
}
