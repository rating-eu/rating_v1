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
