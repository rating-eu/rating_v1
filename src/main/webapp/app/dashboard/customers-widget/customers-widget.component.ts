import * as _ from 'lodash';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';
import { Component, OnInit } from '@angular/core';
import { AttackCostParamType } from '../../entities/attack-cost-param-mgm';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';

@Component({
  selector: 'jhi-customers-widget',
  templateUrl: './customers-widget.component.html',
  styleUrls: ['customers-widget.component.css']
})
export class CustomersWidgetComponent implements OnInit {
  public loading = false;
  public customers = 0;
  private mySelf: SelfAssessmentMgm;

  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private impactService: ImpactEvaluationService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.impactService.getAttackCostParams(this.mySelf).toPromise().then((res) => {
      if (res) {
        const index = _.findIndex(res, { type: AttackCostParamType.NUMBER_OF_CUSTOMERS });
        if (index !== -1) {
          this.customers = res[index].value;
        }
        this.loading = false;
      } else {
        this.loading = false;
      }
    }).catch(() => {
      this.loading = false;
    });
  }

}
