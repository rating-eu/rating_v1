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

import { DashboardStepEnum } from './../models/enumeration/dashboard-step.enum';
import { RiskBoardService, DashboardStatus } from '../risk-board.service';
import { MyAssetRisk } from './../../risk-management/model/my-asset-risk.model';
import * as _ from 'lodash';
import { CriticalLevelMgm } from './../../entities/critical-level-mgm/critical-level-mgm.model';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { RiskManagementService } from '../../risk-management/risk-management.service';
import { Status } from '../../entities/enumerations/QuestionnaireStatus.enum';
import {DatasharingService} from "../../datasharing/datasharing.service";

@Component({
  selector: 'jhi-risk-square-widget',
  templateUrl: './risk-square-widget.component.html',
  styleUrls: ['risk-square-widget.component.css']
})

export class RiskSquareWidgetComponent implements OnInit {
  public loadingRiskLevel = false;
  public loadingAssetsAndAttacks = false;
  public attackCosts = false;
  public isCollapsed = true;
  private mySelf: SelfAssessmentMgm;
  private status: DashboardStatus;
  public criticalLevel: CriticalLevelMgm;
  public myAssetsAtRisk: MyAssetRisk[];
  public squareColumnElement: number[];
  public squareRowElement: number[];
  public lastSquareRowElement: number;
  public bostonSquareCells: string[][] = [];
  public assetsToolTip: Map<number, string> = new Map<number, string>();
  public assetToolTipLoaded = false;
  public assetToolTipLoadedTimer = false;
  private dashboardStatus = DashboardStepEnum;

  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private riskService: RiskManagementService,
    private dashService: RiskBoardService,
    private dataSharingService: DatasharingService
  ) {
  }

  ngOnInit() {
    this.loadingRiskLevel = true;
    this.loadingAssetsAndAttacks = true;
    this.mySelf = this.dataSharingService.selfAssessment;
    this.status = this.dashService.getStatus();
    this.riskService.getCriticalLevel(this.mySelf).toPromise().then((res) => {
      if (res) {
        this.criticalLevel = res;
        this.squareColumnElement = [];
        this.squareRowElement = [];
        this.lastSquareRowElement = this.criticalLevel.side + 1;
        for (let i = 1; i <= this.criticalLevel.side; i++) {
          this.squareColumnElement.push(i);
          this.squareRowElement.push(i);
        }
        this.squareRowElement.push(this.criticalLevel.side + 1);
        this.loadingRiskLevel = false;
      } else {
        this.loadingRiskLevel = false;
      }
    }).catch(() => {
      this.loadingRiskLevel = false;
    });

    this.riskService.getMyAssetsAtRisk(this.mySelf).toPromise().then((res: MyAssetRisk[]) => {
      if (res) {
        this.myAssetsAtRisk = res;
        this.loadingAssetsAndAttacks = false;
      } else {
        this.loadingAssetsAndAttacks = false;
      }
    }).catch(() => {
      this.loadingAssetsAndAttacks = false;
    });

    this.dashService.getStatusFromServer(this.mySelf, this.dashboardStatus.RISK_EVALUATION).toPromise().then((res) => {
      if (Status[res] === Status.EMPTY || Status[res] === Status.PENDING) {
        this.attackCosts = false;
      } else {
        this.attackCosts = true;
      }
      this.status.riskEvaluationStatus = Status[res];
      this.dashService.updateStepStatus(DashboardStepEnum.RISK_EVALUATION, this.status.riskEvaluationStatus);
    });
  }

  public whichLevel(row: number, column: number): string {
    return this.riskService.whichLevel(row, column, this.criticalLevel);
  }

  public whichCriticalContentByCell(row: number, column: number): string {
    if (this.bostonSquareCells.length >= row) {
      if (this.bostonSquareCells[row - 1] && this.bostonSquareCells[row - 1].length >= column) {
        return this.bostonSquareCells[row - 1][column - 1];
      }
    }
    let content = '';
    let fullContent = '';
    let criticalAsset = 0;
    if (this.myAssetsAtRisk.length === 0) {
      return content;
    }
    for (const myAsset of this.myAssetsAtRisk) {
      if (!myAsset.impact && !myAsset.risk) {
        continue;
      }
      if (column === myAsset.impact && Math.pow(row - 1, 2) < myAsset.critical && myAsset.critical <= Math.pow(row, 2)) {
        if (content.length === 0) {
          content = myAsset.asset.name;
        } else {
          criticalAsset++;
        }
        fullContent = fullContent.concat(myAsset.asset.name + ', ');
      }
    }
    content = content.trim();
    const key = row.toString() + column.toString();
    this.assetsToolTip.set(Number(key), fullContent.substr(0, fullContent.length - 2));
    if (!this.assetToolTipLoaded && !this.assetToolTipLoadedTimer) {
      this.assetToolTipLoadedTimer = true;
      setTimeout(() => {
        this.assetToolTipLoaded = true;
      }, 1000);
    }
    if (content.length > 0) {
      content = content.substr(0, 12);
      if (criticalAsset > 0) {
        content = content.concat(' +' + criticalAsset);
      }
    }
    if (!this.bostonSquareCells[row - 1]) {
      this.bostonSquareCells[row - 1] = [];
    }
    this.bostonSquareCells[row - 1][column - 1] = content;
    return content;
  }

  public concatenateAndParse(numbers: number[]): number {
    let mapIndex = '';
    for (const elem of numbers) {
      mapIndex = mapIndex.concat(elem.toString());
    }
    return Number(mapIndex);
  }
}
