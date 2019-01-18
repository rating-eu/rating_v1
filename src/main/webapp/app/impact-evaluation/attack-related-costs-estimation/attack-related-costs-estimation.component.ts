import * as _ from 'lodash';

import { AttackCostMgm, CostType } from './../../entities/attack-cost-mgm/attack-cost-mgm.model';
import { ImpactEvaluationService } from './../impact-evaluation.service';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { Router } from '@angular/router';
import { AttackCostParam } from '../model/attack-cost-param.model';

@Component({
  selector: 'jhi-attack-related-costs-estimation',
  templateUrl: './attack-related-costs-estimation.component.html',
  styleUrls: ['./attack-related-costs-estimation.component.css']
})
export class AttackRelatedCostsEstimationComponent implements OnInit {
  public loadingCosts = false;
  public loadingParams = false;
  public isCollapsed = true;
  public customareNumb: number;
  public attackCosts: AttackCostMgm[] = [];
  public attackCostParams: AttackCostParam[];
  public selectedCost: AttackCostMgm;
  public costs: CostType[] = Object.keys(CostType).filter((key) => !isNaN(Number(key))).map((type) => CostType[type]);
  private mySelf: SelfAssessmentMgm;

  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private impactService: ImpactEvaluationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadingCosts = true;
    this.loadingParams = true;
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.impactService.getAttackCost(this.mySelf).toPromise().then((res) => {
      if (res) {
        this.attackCosts = res;
        this.loadingCosts = false;
      } else {
        this.loadingCosts = false;
      }
    }).catch(() => {
      this.loadingCosts = false;
    });
    this.impactService.getAttackCostParams(this.mySelf).toPromise().then((res) => {
      if (res) {
        this.attackCostParams = res;
        this.loadingParams = false;
      } else {
        this.loadingParams = false;
      }
    }).catch(() => {
      this.loadingParams = false;
    });
  }

  public close() {
    this.router.navigate(['/dashboard']);
  }

  public selectCost(cost: AttackCostMgm) {
    this.isCollapsed = true;
    if (this.selectedCost) {
      if (this.selectedCost.type === cost.type) {
        this.selectedCost = null;
      } else {
        this.selectedCost = cost;
      }
    } else {
      this.selectedCost = cost;
    }

  }

  public updateAttackCost(cost: AttackCostMgm) {
    console.log(cost);
    /*
    this.impactService.updateAttackCost(this.mySelf, cost)
      .toPromise()
      .then((res) => {
        if (res) {
          const index = _.findIndex(this.attackCosts, { type: res.type });
          this.attackCosts.splice(index, 1, res);
        }
      }).catch(() => {

      });
      */
  }

  public evaluateAttackCost(costType: CostType) {
    console.log('SelfAssessment: ' + this.mySelf.id);
    console.log('CostType: ' + this.costs[costType].toString());
    console.log('PARAMS: ');
    console.log(this.attackCostParams);
    /*
    this.impactService.evaluateAttackCost(this.mySelf, this.costs[costType].toString(), this.attackCostParams)
      .toPromise()
      .then((res) => {
        if (res) {
          const index = _.findIndex(this.attackCosts, { type: res.type });
          this.attackCosts.splice(index, 1, res);
        }
      }).catch(() => {

      });
      */
    /*
    console.log(CostType.COST_OF_IT_DOWNTIME);
    console.log(this.costs[CostType.COST_OF_IT_DOWNTIME]);
    */
  }

}
