import {Component, OnInit} from '@angular/core';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {ResultsService} from '../results.service';
import {Result} from '../models/result.model';
import {HttpResponse} from '@angular/common/http';
import {ThreatAgentLikelihoods} from '../../utils/threatagent.likelihoods.class';
import {ThreatAgentMgm} from '../../entities/threat-agent-mgm';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'jhi-results-overview',
    templateUrl: './results-overview.component.html',
    styleUrls: ['../results.css']
})
export class ResultsOverviewComponent implements OnInit {

    selfAssessment: SelfAssessmentMgm;
    threatAgents: ThreatAgentMgm[];
    threatAgentsMap: Map<number, ThreatAgentMgm>;

    result: Result;
    result$: Observable<HttpResponse<Result>>;

    maxLikelihood: number;
    maxLikelihood$: Observable<number>;

    threatAgentLikelihoodsMap: Map<number/*ThreatAgent ID*/, ThreatAgentLikelihoods>;
    threatAgentIDs: number[];

    maxRefinedVulnerability: number = Number.NEGATIVE_INFINITY;

    constructor(private selfAssessmentService: SelfAssessmentMgmService,
                private resultService: ResultsService) {
    }

    ngOnInit() {
        this.selfAssessment = this.selfAssessmentService.getSelfAssessment();
        console.log('SelfAssessment: ' + this.selfAssessment.id);
        this.threatAgents = this.selfAssessment.threatagents;
        this.threatAgentsMap = new Map<number, ThreatAgentMgm>();
        this.threatAgents.forEach((value: ThreatAgentMgm) => {
            this.threatAgentsMap.set(value.id, value);
        });

        this.threatAgentLikelihoodsMap = new Map<number/*ThreatAgentID*/, ThreatAgentLikelihoods>();

        this.maxLikelihood$ = this.resultService.getMax();

        /*this.result$ = this.maxLikelihood$.mergeMap(
            (value: number) => {
                this.maxLikelihood = value;

                return this.resultService.getResult(this.selfAssessment.id);
            }
        );*/

        this.threatAgentIDs = [1, 2, 3, 4, 5];

        this.threatAgentIDs.forEach(id => {
            const threatAgent = new ThreatAgentMgm(id, 'ThreatAgent: ' + id);

            const likelihoods = new ThreatAgentLikelihoods(threatAgent);
            likelihoods.initialLikelihood = (Math.floor(Math.random() * 5) + 1) / 5;
            likelihoods.contextualLikelihood = (Math.floor(Math.random() * 5) + 1) / 5;
            likelihoods.refinedLikelihood = (Math.floor(Math.random() * 5) + 1) / 5;

            this.threatAgentLikelihoodsMap.set(id, likelihoods);
        });

        this.maxRefinedVulnerability = Math.floor(Math.random() * 5) / 5;
    }
}
