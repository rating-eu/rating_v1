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

import * as _ from 'lodash';

import {Component, OnInit} from '@angular/core';
import {ResultsService} from '../../results/results.service';
import {Result} from '../../results/models/result.model';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {HttpResponse} from '@angular/common/http';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {Observable} from "rxjs";
import {ThreatAgentMgm, ThreatAgentMgmService} from "../../entities/threat-agent-mgm";

@Component({
    selector: 'jhi-overall-likelihood-widget',
    templateUrl: './overall-likelihood-widget.component.html',
    styleUrls: ['overall-likelihood-widget.component.css']
})
export class OverallLikelihoodWidgetComponent implements OnInit {
    public loading = false;
    public isCollapsed = true;
    public type = 'bar';
    public legend = false;
    public color = {
        'backgroundColor': ['#ac6e6e', '#7aaa8b', '#779bc0', '#cccb71', '#8480bd', '#ee6055', '#60d394', '#aaf683', '#ffd97d', '#ff9b85', '#674770'],
        'hoverBackgroundColor': ['#ac6e6e', '#7aaa8b', '#779bc0', '#cccb71', '#8480bd', '#ee6055', '#60d394', '#aaf683', '#ffd97d', '#ff9b85', '#674770']
    };
    public options = {
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        }
    };
    public stackedLables: string[] = [];
    public data: any[] = [];

    private mySelf: SelfAssessmentMgm;
    private myCompany: MyCompanyMgm;

    private threatAgents$: Observable<HttpResponse<ThreatAgentMgm[]>>;
    public threatAgents: ThreatAgentMgm[];

    private result: Result;
    private result$: Observable<HttpResponse<Result>>;

    constructor(
        private resultService: ResultsService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private dataSharingService: DatasharingService,
        private threatAgentService: ThreatAgentMgmService
    ) {
    }

    ngOnInit() {
        this.loading = true;
        this.mySelf = this.dataSharingService.selfAssessment;
        this.myCompany = this.dataSharingService.myCompany;

        this.threatAgents$ = this.threatAgentService.getThreatAgentsByCompany(this.myCompany.companyProfile.id);

        this.result$ = this.threatAgents$.pipe().switchMap((response: HttpResponse<ThreatAgentMgm[]>) => {
            this.threatAgents = response.body;

            return this.resultService.getResult(this.mySelf.id);
        });

        this.result$.toPromise().then((res: HttpResponse<Result>) => {
            if (res.body) {
                this.initDataForGraph();
                this.result = res.body;
                if (this.result.initialVulnerability.size > 0) {
                    let iIndex = 0;
                    const iLabels: string[] = [];
                    const iLocalData: number[] = [];
                    this.result.initialVulnerability.forEach((item, key, map) => {
                        const tIndex = _.findIndex(this.threatAgents, {id: key});
                        iLabels.push(this.threatAgents[tIndex].name);
                        iLocalData.push(item);
                        if (iIndex === map.size - 1) {
                            this.stackedLables = iLabels;
                            const iElem = {
                                label: 'Initial',
                                backgroundColor: '#ac6e6e',
                                data: iLocalData
                            };
                            this.data.push(iElem);
                        }
                        iIndex++;
                    });
                }
                if (this.result.contextualVulnerability.size > 0) {
                    let cIndex = 0;
                    const cLabels: string[] = [];
                    const cLocalData: number[] = [];
                    this.result.contextualVulnerability.forEach((item, key, map) => {
                        const tIndex = _.findIndex(this.threatAgents, {id: key});
                        cLabels.push(this.threatAgents[tIndex].name);
                        cLocalData.push(item);
                        if (cIndex === map.size - 1) {
                            if (this.stackedLables.length === 0) {
                                this.stackedLables = cLabels;
                            }
                            const cElem = {
                                label: 'Contextual',
                                backgroundColor: '#7aaa8b',
                                data: cLocalData
                            };
                            this.data.push(cElem);
                        }
                        cIndex++;
                    });
                }
                if (this.result.refinedVulnerability.size > 0) {
                    let rIndex = 0;
                    const rLabels: string[] = [];
                    const rLocalData: number[] = [];
                    this.result.refinedVulnerability.forEach((item, key, map) => {
                        const tIndex = _.findIndex(this.threatAgents, {id: key});
                        rLabels.push(this.threatAgents[tIndex].name);
                        rLocalData.push(item);
                        if (rIndex === map.size - 1) {
                            if (this.stackedLables.length === 0) {
                                this.stackedLables = rLabels;
                            }
                            const rElem = {
                                label: 'Refined',
                                backgroundColor: '#779bc0',
                                data: rLocalData
                            };
                            this.data.push(rElem);
                        }
                        rIndex++;
                    });
                }
                this.loading = false;
            } else {
                this.loading = false;
            }
        }).catch(() => {
            this.loading = false;
        });
    }

    private initDataForGraph() {
        this.stackedLables = [];
        this.data = [];
    }

}
