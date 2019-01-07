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
  public isCollapsed = true;
  public companySector: string;
  public tableInfo: {
    splitting: string,
    value: number,
    type: string
  }[];
  public selectedSplitting: string;
  public selectedSplittingElement: string[];

  private wp3Status: ImpactEvaluationStatus;
  private mySelf: SelfAssessmentMgm;

  constructor(
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
  ) { }

  ngOnInit() {
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
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
                  value: Math.round(impact.loss * 100) / 100,
                  type: 'IP'
                });
              }
              break;
            }
            case MyCategoryType.KEY_COMP.toString(): {
              if (impact.sectorType.toString() !== MySectorType.GLOBAL.toString()) {
                this.tableInfo.push({
                  splitting: 'Key Competences',
                  value: Math.round(impact.loss * 100) / 100,
                  type: 'KEY_COMP'
                });
              }
              break;
            }
            case MyCategoryType.ORG_CAPITAL.toString(): {
              if (impact.sectorType.toString() !== MySectorType.GLOBAL.toString()) {
                this.tableInfo.push({
                  splitting: 'Organizational Capital (Reputation & Brand included )',
                  value: Math.round(impact.loss * 100) / 100,
                  type: 'ORG_CAPITAL'
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
  /*
  public selectSplitting(splittingType: string) {
    if (this.selectedSplitting === splittingType) {
      this.selectedSplitting = undefined;
    } else {
      this.selectedSplitting = splittingType;
    }
    this.selectedSplittingElement = [];
    switch (splittingType) {
      case ('IP'): {
        this.selectedSplittingElement.push('IP asset / IP in progress either internally or with offices');
        this.selectedSplittingElement.push('Trade / business secrets');
        this.selectedSplittingElement.push('Industial process');
        this.selectedSplittingElement.push('On-going R&D innovation projects');
        this.selectedSplittingElement.push('On-going new product and new services');
        this.selectedSplittingElement.push('On-going new business models projects');
        break;
      }
      case ('ORG_CAPITAL'): {
        this.selectedSplittingElement.push('Digital supported process');
        this.selectedSplittingElement.push('Non-digitised functional and interfunctional processes');
        this.selectedSplittingElement.push('Eco-system\'s processes');
        this.selectedSplittingElement.push('Firm / organisation\'s strategic capabilities');
        break;
      }
      case ('KEY_COMP'): {
        this.selectedSplittingElement.push('Firm\'s personnel key competences (tacit knowledge)');
        this.selectedSplittingElement.push('Personnel moral and trust in the organisation');
        this.selectedSplittingElement.push('Peronnel learning capabilities');
        break;
      }
      case ('DATA'): {
        this.selectedSplittingElement.push('Digitised data on clients');
        this.selectedSplittingElement.push('Digitised data on personnel');
        this.selectedSplittingElement.push('Digitised data on suppliers and ecosystems');
        this.selectedSplittingElement.push('Digitised data on functions (HR, finance and fiscal)');
        break;
      }
      case ('REPUTATION'): {
        this.selectedSplittingElement.push('Reputation with clients, stakeholders and firm\'s ecosystems');
        this.selectedSplittingElement.push('Brand value with customers, stakeholders and firm / organisation\'s ecosystem');
        break;
      }
    }
  }
  */
}
