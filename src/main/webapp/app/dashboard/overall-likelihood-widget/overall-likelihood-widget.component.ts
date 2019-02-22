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
  public isCollapsed = true;
  public type = 'bar';
  public legend = false;
  // public initialLabels: string[] = [];
  // public initialData: number[] = [];
  // public contextualLabels: string[] = [];
  // public contextualData: number[] = [];
  // public refinedLabels: string[] = [];
  // public refinedData: number[] = [];
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
        if (this.results.initialVulnerability.size > 0) {
          let iIndex = 0;
          const iLabels: string[] = [];
          const iLocalData: number[] = [];
          this.results.initialVulnerability.forEach((item, key, map) => {
            const tIndex = _.findIndex(this.mySelf.threatagents, { id: key });
            iLabels.push(this.mySelf.threatagents[tIndex].name);
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
        if (this.results.contextualVulnerability.size > 0) {
          let cIndex = 0;
          const cLabels: string[] = [];
          const cLocalData: number[] = [];
          this.results.contextualVulnerability.forEach((item, key, map) => {
            const tIndex = _.findIndex(this.mySelf.threatagents, { id: key });
            cLabels.push(this.mySelf.threatagents[tIndex].name);
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
        if (this.results.refinedVulnerability.size > 0) {
          let rIndex = 0;
          const rLabels: string[] = [];
          const rLocalData: number[] = [];
          this.results.refinedVulnerability.forEach((item, key, map) => {
            const tIndex = _.findIndex(this.mySelf.threatagents, { id: key });
            rLabels.push(this.mySelf.threatagents[tIndex].name);
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
