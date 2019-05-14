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
import {ImpactEvaluationService} from '../../impact-evaluation.service';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SelfAssessmentMgmService, SelfAssessmentMgm} from '../../../entities/self-assessment-mgm';
import {GrowthRate} from '../model/growth-rates.model';
import {Router} from '@angular/router';
import {DatasharingService} from "../../../datasharing/datasharing.service";

@Component({
    selector: 'jhi-growth-rates-configurator-component',
    templateUrl: './growth-rates-configurator-component.component.html',
    styles: []
})
export class GrowthRatesConfiguratorComponentComponent implements OnInit {
    public loading = false;
    private mySelf: SelfAssessmentMgm;
    public rates: GrowthRate[] = [];

    @Output()
    public isGrowthRateUpdated: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private impactService: ImpactEvaluationService,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private router: Router,
        private dataSharingService: DatasharingService
    ) {
    }

    ngOnInit() {
        this.loading = true;
        this.mySelf = this.dataSharingService.selfAssessment;
        this.impactService.getGrowthRates(this.mySelf).toPromise().then((res) => {
            if (res) {
                this.rates = res;
                this.rates = _.orderBy(this.rates, ['year'], ['asc']);
                this.loading = false;
            } else {
                this.loading = false;
            }
        }).catch(() => {
            this.loading = false;
        });
    }

    public close() {
        this.router.navigate(['/riskboard']);
    }

    public updateRates() {
        this.impactService.updateGrowthRates(this.mySelf, this.rates).toPromise().then((res) => {
            if (res) {
                this.rates = res;
                this.rates = _.orderBy(this.rates, ['year'], ['asc']);
                this.isGrowthRateUpdated.emit(true);
            } else {
                this.isGrowthRateUpdated.emit(false);
            }
        });
    }
}
