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
  public results: Result;
  private mySelf: SelfAssessmentMgm;

  constructor(
    private resultService: ResultsService,
    private selfAssessmentService: SelfAssessmentMgmService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.selfAssessmentService.getSelfAssessment();
    this.resultService.getResult(this.mySelf.id).toPromise().then((res: HttpResponse<Result>) => {
      if (res.body) {
        this.results = res.body;
        console.log(this.results);
        this.loading = false;
      } else {
        this.loading = false;
      }
    }).catch(() => {
      this.loading = false;
    });
  }

}
