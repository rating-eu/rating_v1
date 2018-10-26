import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../results/results.service';
import { Result } from '../../results/models/result.model';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-overall-likelihood-widget',
  templateUrl: './overall-likelihood-widget.component.html',
  styleUrls: ['overall-likelihood-widget.component.css']
})
export class OverallLikelihoodWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = false;
  public type = 'doughnut';
  public legend = false;
  public initialLabels: string[] = [];
  public initialData: number[] = [];
  public contextualLabels: string[] = [];
  public contextualData: number[] = [];
  public refinedLabels: string[] = [];
  public refinedData: number[] = [];
  public color = {
    'backgroundColor': ['#ac6e6e', '#7aaa8b', '#779bc0', '#cccb71', '#8480bd', '#ee6055', '#60d394', '#aaf683', '#ffd97d', '#ff9b85', '#674770'],
    'hoverBackgroundColor': ['#ac6e6e', '#7aaa8b', '#779bc0', '#cccb71', '#8480bd', '#ee6055', '#60d394', '#aaf683', '#ffd97d', '#ff9b85', '#674770']
  };

  private mySelf: SelfAssessmentMgm;
  private results: Result;

  constructor(
    private resultService: ResultsService,
    private selfAssessmentService: SelfAssessmentMgmService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.selfAssessmentService.getSelfAssessment();
    this.resultService.getResult(this.mySelf.id).toPromise().then((res: HttpResponse<Result>) => {
      if (res.body) {
        this.initDataForGraph();
        this.results = res.body;
        this.results.initialVulnerability.forEach((item, key) => {
          const tIndex = _.findIndex(this.mySelf.threatagents, { id: key });
          this.initialLabels.push(this.mySelf.threatagents[tIndex].name);
          this.initialData.push(item);
        });
        this.results.contextualVulnerability.forEach((item, key) => {
          const tIndex = _.findIndex(this.mySelf.threatagents, { id: key });
          this.contextualLabels.push(this.mySelf.threatagents[tIndex].name);
          this.contextualData.push(item);
        });
        this.results.refinedVulnerability.forEach((item, key) => {
          const tIndex = _.findIndex(this.mySelf.threatagents, { id: key });
          this.refinedLabels.push(this.mySelf.threatagents[tIndex].name);
          this.refinedData.push(item);
        });
        this.loading = false;
      } else {
        this.loading = false;
      }
    }).catch(() => {
      this.loading = false;
    });
  }

  private initDataForGraph() {
    this.contextualData = [];
    this.initialData = [];
    this.refinedData = [];
    this.initialLabels = [];
    this.refinedLabels = [];
    this.contextualLabels = [];
  }

}
