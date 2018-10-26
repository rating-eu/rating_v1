import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { RiskManagementService } from '../../risk-management/risk-management.service';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { MyAssetAttackChance } from '../../risk-management/model/my-asset-attack-chance.model';
import { AttackStrategyMgm } from '../../entities/attack-strategy-mgm';

@Component({
  selector: 'jhi-attack-strategies-widget',
  templateUrl: './attack-strategies-widget.component.html',
  styleUrls: ['attack-strategies-widget.component.css']
})
export class AttackStrategiesWidgetComponent implements OnInit {
  public loading = false;
  public myAssets: MyAssetMgm[] = [];
  public mapAssetAttacks: Map<number, MyAssetAttackChance[]> = new Map<number, MyAssetAttackChance[]>();
  public attacksMapCounter = 0;

  private attacksMap: Map<number /*AttackStrategyID*/, AttackStrategyMgm> = new Map<number, AttackStrategyMgm>();
  private mySelf: SelfAssessmentMgm;

  constructor(
    private riskService: RiskManagementService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();

    this.riskService.getMyAssets(this.mySelf).toPromise().then((res) => {
      if (res && res.length > 0) {
        this.myAssets = res;
        for (const myAsset of this.myAssets) {
          this.riskService.getAttackChance(myAsset, this.mySelf).toPromise().then((res2) => {
            if (res2) {
              this.mapAssetAttacks.set(myAsset.id, res2);
              for (const elem of res2) {
                if (!this.attacksMap.has(elem.attackStrategy.id)) {
                  this.attacksMap.set(elem.attackStrategy.id, elem.attackStrategy);
                  this.attacksMapCounter ++;
                }
              }
            }
          });
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
