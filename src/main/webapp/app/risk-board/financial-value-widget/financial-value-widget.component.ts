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

import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { ImpactEvaluationStatus} from "../../impact-evaluation/quantitative/model/impact-evaluation-status.model";
import { Component, OnInit } from '@angular/core';
import { ImpactEvaluationService } from '../../impact-evaluation/impact-evaluation.service';
import {DatasharingService} from "../../datasharing/datasharing.service";

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
    private dataSharingService: DatasharingService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.dataSharingService.selfAssessment;

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
