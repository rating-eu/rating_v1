import * as _ from 'lodash';

import { AttackCostMgm, CostType } from './../../entities/attack-cost-mgm/attack-cost-mgm.model';
import { ImpactEvaluationService } from './../impact-evaluation.service';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { Router } from '@angular/router';
import { AttackCostParam } from '../model/attack-cost-param.model';
import { AttackCostParamType } from '../model/enum/attack-cost-param-type.enum';

@Component({
  selector: 'jhi-attack-related-costs-estimation',
  templateUrl: './attack-related-costs-estimation.component.html',
  styleUrls: ['./attack-related-costs-estimation.component.css']
})
export class AttackRelatedCostsEstimationComponent implements OnInit {
  public loadingCosts = false;
  public loadingParams = false;
  public isCollapsed = true;
  public customers: number;
  public protectionMin: number;
  public protectionMax: number;
  public notificationMin: number;
  public notificationMax: number;
  public employeeCosts: number;
  public fractionEmployee: number;
  public averageRevenue: number;
  public fractionRevenue: number;
  public recoveryCost: number;
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
        let index = _.findIndex(this.attackCostParams, function(elem) {
          return elem.type.toString() === AttackCostParamType[AttackCostParamType.NUMBER_OF_CUSTOMERS];
        });
        if (index !== -1) {
          this.customers = this.attackCostParams[index].value;
        }
        index = _.findIndex(this.attackCostParams, function(elem) {
          return elem.type.toString() === AttackCostParamType[AttackCostParamType.NOTIFICATION_COST_PER_CUSTOMER];
        });
        if (index !== -1) {
          this.notificationMin = this.attackCostParams[index].min;
          this.notificationMax = this.attackCostParams[index].max;
        }
        index = _.findIndex(this.attackCostParams, function(elem) {
          return elem.type.toString() === AttackCostParamType[AttackCostParamType.PROTECTION_COST_PER_CUSTOMER];
        });
        if (index !== -1) {
          this.protectionMin = this.attackCostParams[index].min;
          this.protectionMax = this.attackCostParams[index].max;
        }
        index = _.findIndex(this.attackCostParams, function(elem) {
          return elem.type.toString() === AttackCostParamType[AttackCostParamType.EMPLOYEE_COST_PER_HOUR];
        });
        if (index !== -1) {
          this.employeeCosts = this.attackCostParams[index].value;
        }
        index = _.findIndex(this.attackCostParams, function(elem) {
          return elem.type.toString() === AttackCostParamType[AttackCostParamType.FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE];
        });
        if (index !== -1) {
          this.fractionEmployee = this.attackCostParams[index].value;
        }
        index = _.findIndex(this.attackCostParams, function(elem) {
          return elem.type.toString() === AttackCostParamType[AttackCostParamType.AVERAGE_REVENUE_PER_HOUR];
        });
        if (index !== -1) {
          this.averageRevenue = this.attackCostParams[index].value;
        }
        index = _.findIndex(this.attackCostParams, function(elem) {
          return elem.type.toString() === AttackCostParamType[AttackCostParamType.FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE];
        });
        if (index !== -1) {
          this.fractionRevenue = this.attackCostParams[index].value;
        }
        index = _.findIndex(this.attackCostParams, function(elem) {
          return elem.type.toString() === AttackCostParamType[AttackCostParamType.RECOVERY_COST];
        });
        if (index !== -1) {
          this.recoveryCost = this.attackCostParams[index].value;
        }
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
    this.impactService.updateAttackCost(this.mySelf, cost)
      .toPromise()
      .then((res) => {
        if (res) {
          const index = _.findIndex(this.attackCosts, { type: res.type });
          this.attackCosts.splice(index, 1, res);
        }
      }).catch(() => {

      });
  }

  public updateCreateAttackCostParam(value: number, type: string) {
    const paramType: AttackCostParamType = AttackCostParamType[type];
    const index = _.findIndex(this.attackCostParams, function(elem) {
      return elem.type.toString() === AttackCostParamType[paramType].toString();
    });
    if (index !== -1) {
      this.attackCostParams[index].value = value;
      this.impactService.updateCreateAttackCostParam(this.attackCostParams[index]).toPromise().then((res) => {
        if (res) {
          const ind = _.findIndex(this.attackCostParams, { id: res.id });
          this.attackCostParams.splice(ind, 1, res);
          if (paramType === AttackCostParamType.NUMBER_OF_CUSTOMERS) {
            this.ngOnInit();
          }
        }
      });
    } else {
      const param: AttackCostParam = new AttackCostParam();
      param.value = value;
      param.type = paramType;
      param.selfAssessment = this.mySelf;
      this.impactService.updateCreateAttackCostParam(param).toPromise().then((res) => {
        if (res) {
          this.attackCostParams.push(res);
          if (paramType === AttackCostParamType.NUMBER_OF_CUSTOMERS) {
            this.ngOnInit();
          }
        }
      });
    }

  }

  public evaluateAttackCost(type: string) {
    const costType: CostType = CostType[type];
    for (const param of this.attackCostParams) {
      if (!param.selfAssessment) {
        param.selfAssessment = this.mySelf;
      } else {
        if (param.selfAssessment.id !== this.mySelf.id) {
          param.selfAssessment = this.mySelf;
        }
      }
    }
    if (costType === CostType.COST_OF_IT_DOWNTIME) {
      let index = _.findIndex(this.attackCostParams, function(elem) {
        return elem.type.toString() === AttackCostParamType[AttackCostParamType.EMPLOYEE_COST_PER_HOUR];
      });
      if (index !== -1) {
        this.attackCostParams[index].value = this.employeeCosts;
      } else {
        const param: AttackCostParam = new AttackCostParam();
        param.value = this.employeeCosts;
        param.type = AttackCostParamType[AttackCostParamType[AttackCostParamType.EMPLOYEE_COST_PER_HOUR]];
        param.selfAssessment = this.mySelf;
        this.attackCostParams.push(param);
      }
      index = _.findIndex(this.attackCostParams, function(elem) {
        return elem.type.toString() === AttackCostParamType[AttackCostParamType.FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE];
      });
      if (index !== -1) {
        this.attackCostParams[index].value = this.fractionEmployee;
      } else {
        const param: AttackCostParam = new AttackCostParam();
        param.value = this.fractionEmployee;
        param.type = AttackCostParamType[AttackCostParamType[AttackCostParamType.FRACTION_OF_EMPLOYEES_AFFECTED_BY_OUTAGE]];
        param.selfAssessment = this.mySelf;
        this.attackCostParams.push(param);
      }
      index = _.findIndex(this.attackCostParams, function(elem) {
        return elem.type.toString() === AttackCostParamType[AttackCostParamType.AVERAGE_REVENUE_PER_HOUR];
      });
      if (index !== -1) {
        this.attackCostParams[index].value = this.averageRevenue;
      } else {
        const param: AttackCostParam = new AttackCostParam();
        param.value = this.averageRevenue;
        param.type = AttackCostParamType[AttackCostParamType[AttackCostParamType.AVERAGE_REVENUE_PER_HOUR]];
        param.selfAssessment = this.mySelf;
        this.attackCostParams.push(param);
      }
      index = _.findIndex(this.attackCostParams, function(elem) {
        return elem.type.toString() === AttackCostParamType[AttackCostParamType.FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE];
      });
      if (index !== -1) {
        this.attackCostParams[index].value = this.fractionRevenue;
      } else {
        const param: AttackCostParam = new AttackCostParam();
        param.value = this.fractionRevenue;
        param.type = AttackCostParamType[AttackCostParamType[AttackCostParamType.FRACTION_OF_REVENUE_AFFECTED_BY_OUTAGE]];
        param.selfAssessment = this.mySelf;
        this.attackCostParams.push(param);
      }
      index = _.findIndex(this.attackCostParams, function(elem) {
        return elem.type.toString() === AttackCostParamType[AttackCostParamType.RECOVERY_COST];
      });
      if (index !== -1) {
        this.attackCostParams[index].value = this.recoveryCost;
      } else {
        const param: AttackCostParam = new AttackCostParam();
        param.value = this.recoveryCost;
        param.type = AttackCostParamType[AttackCostParamType[AttackCostParamType.RECOVERY_COST]];
        param.selfAssessment = this.mySelf;
        this.attackCostParams.push(param);
      }
    }
    console.log('SelfAssessment: ' + this.mySelf.id);
    console.log('CostType: ' + this.costs[costType].toString());
    console.log('PARAMS: ');
    console.log(this.attackCostParams);
    console.log(this.costs[costType].toString());
    this.impactService.evaluateAttackCost(this.mySelf, this.costs[costType].toString(), this.attackCostParams)
      .toPromise()
      .then((res) => {
        if (res) {
          const index = _.findIndex(this.attackCosts, function(elem) {
            return elem.type.toString() === res.type.toString();
          });
          this.attackCosts.splice(index, 1, res);
        }
      }).catch(() => {

      });
    /*
    console.log(CostType.COST_OF_IT_DOWNTIME);
    console.log(this.costs[CostType.COST_OF_IT_DOWNTIME]);
    */
  }

}
