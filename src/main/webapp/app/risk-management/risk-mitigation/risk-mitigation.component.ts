import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../../../../../../node_modules/ngx-webstorage';
import { MyAssetAttackChance } from '../model/my-asset-attack-chance.model';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'risk-mitigation',
  templateUrl: './risk-mitigation.component.html',
  styles: []
})
export class RiskMitigationComponent implements OnInit {
  public attacks: MyAssetAttackChance[];
  public asset: MyAssetMgm;

  constructor(
    private sessionStorage: SessionStorageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.attacks = this.sessionStorage.retrieve('selectedAttacksChence');
    this.asset = this.sessionStorage.retrieve('selectedAsset');
    this.sessionStorage.clear('selectedAttacksChence');
    this.sessionStorage.clear('selectedAsset');
    if (!this.asset && !this.attacks) {
      this.router.navigate(['risk-management/risk-evaluation']);
    }
  }

}
