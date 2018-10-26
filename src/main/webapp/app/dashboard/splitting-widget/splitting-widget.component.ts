import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';
import { MyCategoryType } from '../../entities/enumerations/MyCategoryType.enum';
import { MySectorType } from '../../entities/enumerations/MySectorType.enum';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { ImpactEvaluationStatus } from '../../impact-evaluation/model/impact-evaluation-status.model';

@Component({
  selector: 'jhi-splitting-widget',
  templateUrl: './splitting-widget.component.html',
  styleUrls: ['splitting-widget.component.css']
})
export class SplittingWidgetComponent implements OnInit {
  public loading = false;
  public isCollapsed = false;
  public companySector: string;
  public tableInfo: {
    splitting: string,
    value: number
  }[];

  private wp3Status: ImpactEvaluationStatus;
  private mySelf: SelfAssessmentMgm;

  constructor(
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
  ) { }

  ngOnInit() {
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    // Retrieve the wp3 status from server
    this.impactService.getStatus(this.mySelf).toPromise().then((status) => {
      if (status) {
        this.wp3Status = status;
        this.tableInfo = [];
        for (const impact of this.wp3Status.splittingLosses) {
          if (!this.companySector && impact.sectorType.toString() !== MySectorType.GLOBAL.toString()) {
            this.companySector = impact.sectorType.toString().charAt(0).toUpperCase() + impact.sectorType.toString().slice(1).toLowerCase();
          }
          switch (impact.categoryType.toString()) {
            case MyCategoryType.IP.toString(): {
              if (impact.sectorType.toString() !== MySectorType.GLOBAL.toString()) {
                this.tableInfo.push({
                  splitting: 'Intellectual Properties',
                  value: Math.round(impact.loss * 100) / 100
                });
              }
              break;
            }
            case MyCategoryType.KEY_COMP.toString(): {
              if (impact.sectorType.toString() !== MySectorType.GLOBAL.toString()) {
                this.tableInfo.push({
                  splitting: 'Key Competences',
                  value: Math.round(impact.loss * 100) / 100
                });
              }
              break;
            }
            case MyCategoryType.ORG_CAPITAL.toString(): {
              if (impact.sectorType.toString() !== MySectorType.GLOBAL.toString()) {
                this.tableInfo.push({
                  splitting: 'Organizational Capital (Reputation & Brand included )',
                  value: Math.round(impact.loss * 100) / 100
                });
              }
              break;
            }
            // TODO case with Data (calculated by D4.3 methodology)
          }
        }
      }
    });
  }

}
