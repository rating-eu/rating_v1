import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../../../../../../node_modules/ngx-webstorage';
import { MyAssetAttackChance } from '../model/my-asset-attack-chance.model';
import { MyAssetMgm } from '../../entities/my-asset-mgm';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'risk-mitigation',
  templateUrl: './risk-mitigation.component.html',
  styles: []
})
export class RiskMitigationComponent implements OnInit {
  public content = '';
  public attacks: MyAssetAttackChance[];
  public asset: MyAssetMgm;

  constructor(
    private sessionStorage: SessionStorageService
  ) { }

  ngOnInit() {
    this.attacks = this.sessionStorage.retrieve('selectedAttacksChence');
    this.asset = this.sessionStorage.retrieve('selectedAsset');
    this.sessionStorage.clear('selectedAttacksChence');
    this.sessionStorage.clear('selectedAsset');
    for (const attack of this.attacks) {
      const likelihoodVulnerability = attack.likelihood * attack.vulnerability;
      this.content = this.content.concat(attack.attackStrategy.name, ' ');
    }
  }

}
