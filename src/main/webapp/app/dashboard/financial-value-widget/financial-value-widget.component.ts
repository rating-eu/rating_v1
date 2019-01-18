import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { ImpactEvaluationStatus } from './../../impact-evaluation/model/impact-evaluation-status.model';
import { Component, OnInit } from '@angular/core';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';
import { SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';

@Component({
  selector: 'jhi-financial-value-widget',
  templateUrl: './financial-value-widget.component.html',
  styleUrls: ['financial-value-widget.component.css']
})
export class FinancialValueWidgetComponent implements OnInit {
  public loading = false;
  public ide: number;
  public intangibleCapital: number;
  public physicalReturn: number;
  public financialReturn: number;

  private wp3Status: ImpactEvaluationStatus;
  private mySelf: SelfAssessmentMgm;

  constructor(
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.impactService.getStatus(this.mySelf).toPromise().then((status) => {
      if (status) {
        this.wp3Status = status;
        this.ide = this.wp3Status.economicResults.intangibleDrivingEarnings;
        this.intangibleCapital = this.wp3Status.economicResults.intangibleCapital;
        this.physicalReturn = this.wp3Status.economicCoefficients.physicalAssetsReturn;
        this.financialReturn = this.wp3Status.economicCoefficients.financialAssetsReturn;
        this.loading = false;
      }
    }).catch(() => {
      this.loading = false;
    });
  }

}
