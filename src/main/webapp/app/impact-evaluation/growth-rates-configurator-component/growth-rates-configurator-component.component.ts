import * as _ from 'lodash';
import {ImpactEvaluationService} from './../impact-evaluation.service';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SelfAssessmentMgmService, SelfAssessmentMgm} from '../../entities/self-assessment-mgm';
import {GrowthRate} from '../model/growth-rates.model';
import {Router} from '@angular/router';

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
        private router: Router
    ) {
    }

    ngOnInit() {
        this.loading = true;
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
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
        this.router.navigate(['/dashboard']);
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
