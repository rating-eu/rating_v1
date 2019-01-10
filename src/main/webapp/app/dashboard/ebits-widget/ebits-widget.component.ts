import { SelfAssessmentMgmService } from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import * as _ from 'lodash';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { ImpactEvaluationStatus } from './../../impact-evaluation/model/impact-evaluation-status.model';
import { ImpactEvaluationService } from './../../impact-evaluation/impact-evaluation.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-ebits-widget',
  templateUrl: './ebits-widget.component.html',
  styleUrls: ['ebits-widget.component.css']
})
export class EbitsWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = true;
  private wp3Status: ImpactEvaluationStatus;
  private mySelf: SelfAssessmentMgm;
  public ebitInfo: {
    year: string,
    thisYear: boolean,
    value: number
  }[];

  constructor(
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.impactService.getStatus(this.mySelf).toPromise().then((status) => {
      if (status) {
        this.wp3Status = status;
        this.ebitInfo = [];
        this.wp3Status.ebits = _.orderBy(this.wp3Status.ebits, ['year'], ['asc']);
        let index = 1;
        const year = (new Date()).getFullYear();
        for (const ebit of this.wp3Status.ebits) {
          this.ebitInfo.push(
            {
              year: ebit.year.toString(),
              thisYear: ebit.year ===  year,
              value: ebit.value
            });
          index++;
        }
        console.log(this.ebitInfo);
        this.loading = false;
      }
    }).catch(() => {
      this.wp3Status = null;
      this.ebitInfo = [];
    });
  }

}
