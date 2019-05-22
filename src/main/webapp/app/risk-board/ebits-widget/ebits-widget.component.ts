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

import { SelfAssessmentMgmService } from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import * as _ from 'lodash';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { ImpactEvaluationStatus} from "../../impact-evaluation/quantitative/model/impact-evaluation-status.model";
import { ImpactEvaluationService } from './../../impact-evaluation/impact-evaluation.service';
import { Component, OnInit } from '@angular/core';
import {DatasharingService} from "../../datasharing/datasharing.service";

interface OrderBy {
  year: boolean;
  value: boolean;
  type: string;
}

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
  public ebitOrderBy: OrderBy;
  public ebitInfo: {
    year: string,
    thisYear: boolean,
    value: number
  }[];

  constructor(
    private impactService: ImpactEvaluationService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private dataSharingService: DatasharingService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.dataSharingService.selfAssessment;
    this.ebitOrderBy = {
      year: false,
      value: false,
      type: 'desc'
    };
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
              thisYear: ebit.year === year,
              value: ebit.value
            });
          index++;
        }
        this.loading = false;
      }
    }).catch(() => {
      this.wp3Status = null;
      this.loading = false;
      this.ebitInfo = [];
    });
  }

  private resetOrder() {
    this.ebitOrderBy.year = false;
    this.ebitOrderBy.value = false;
    this.ebitOrderBy.type = 'desc';
  }

  public tableOrderBy(orderColumn: string, desc: boolean) {
    this.resetOrder();
    if (desc) {
      this.ebitOrderBy.type = 'desc';
    } else {
      this.ebitOrderBy.type = 'asc';
    }
    switch (orderColumn.toLowerCase()) {
      case ('year'): {
        this.ebitOrderBy.year = true;
        if (desc) {
          this.ebitInfo = _.orderBy(this.ebitInfo, ['year'], ['desc']);
        } else {
          this.ebitInfo = _.orderBy(this.ebitInfo, ['year'], ['asc']);
        }
        break;
      }
      case ('value'): {
        this.ebitOrderBy.value = true;
        if (desc) {
          this.ebitInfo = _.orderBy(this.ebitInfo, ['value'], ['desc']);
        } else {
          this.ebitInfo = _.orderBy(this.ebitInfo, ['value'], ['asc']);
        }
        break;
      }
    }
  }

}
