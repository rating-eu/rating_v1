import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../../../../../../node_modules/ngx-webstorage';
import { MyAssetAttackChance } from '../model/my-asset-attack-chance.model';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { AttackStrategyMgm } from '../../entities/attack-strategy-mgm';
import { MitigationMgm } from '../../entities/mitigation-mgm';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'risk-mitigation',
  templateUrl: './risk-mitigation.component.html',
  styleUrls: ['./risk-mitigation.component.css'],
})
export class RiskMitigationComponent implements OnInit {
  public loading = false;
  public attacks: MyAssetAttackChance[];
  public asset: MyAssetMgm;
  public isViewDivDetailsVisible = false;
  public datailParam: number;
  public selectedAttack: AttackStrategyMgm;
  public selectedMitigations: MitigationMgm[];
  public loadingMitigationsTable = false;
  public mitigationsPaginator = {
    id: 'mitigation_paginator',
    itemsPerPage: 7,
    currentPage: 1
  };
  public attacksPaginator = {
    id: 'attack_paginator',
    itemsPerPage: 7,
    currentPage: 1
  };
  constructor(
    private sessionStorage: SessionStorageService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.attacks = this.sessionStorage.retrieve('selectedAttacksChence');
    this.asset = this.sessionStorage.retrieve('selectedAsset');
    this.sessionStorage.clear('selectedAttacksChence');
    this.sessionStorage.clear('selectedAsset');
    if (!this.asset && !this.attacks) {
      this.loading = false;
      return;
    }
    this.loading = false;
  }

  public viewDivDetails(id: number) {
    this.datailParam = id;
    this.isViewDivDetailsVisible = true;
  }

  public onMitigationPageChange(number: number) {
    this.isViewDivDetailsVisible = false;
    this.mitigationsPaginator.currentPage = number;
  }

  public onAttackPageChange(number: number) {
    this.isViewDivDetailsVisible = false;
    this.attacksPaginator.currentPage = number;
  }

  public selectAttack(attack: AttackStrategyMgm) {
    this.isViewDivDetailsVisible = false;
    if (this.selectedAttack) {
      if (this.selectedAttack.id === attack.id) {
        this.selectedAttack = null;
        return;
      }
    }
    this.selectedAttack = attack;
    this.loadingMitigationsTable = true;
    this.selectedMitigations = [];
    this.selectedMitigations = this.selectedAttack.mitigations;
    this.loadingMitigationsTable = false;
  }

}
