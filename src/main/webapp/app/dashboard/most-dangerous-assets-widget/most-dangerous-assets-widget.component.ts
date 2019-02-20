import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { SelfAssessmentOverview } from '../../my-self-assessments/models/SelfAssessmentOverview.model';
import { AugmentedMyAsset } from '../../my-self-assessments/models/AugmentedMyAsset.model';
import { AugmentedAttackStrategy } from '../../evaluate-weakness/models/augmented-attack-strategy.model';

interface MdawEntity {
  asset: AugmentedMyAsset;
  mostDangerousAttack: string;
  howManyAttacks: number;
  mostDangerousAttackValue: {
    likelihood: number,
    vulnerability: number
  };
}

interface OrderBy {
  asset: boolean;
  attackStrategy: boolean;
  likelihood: boolean;
  vulnerability: boolean;
  type: string;
}

@Component({
  selector: 'jhi-most-dangerous-assets-widget',
  templateUrl: './most-dangerous-assets-widget.component.html',
  styleUrls: ['most-dangerous-assets-widget.component.css']
})
export class MostDangerousAssetsWidgetComponent implements OnInit {
  public isCollapsed = true;
  public loading = false;
  public loadingAttacksTable = false;
  public selectedAsset: AugmentedMyAsset;
  public selectedAttacks: AugmentedAttackStrategy[];
  public tangibleAssetsPaginator = {
    id: 'intangible_asset_paginator',
    itemsPerPage: 7,
    currentPage: 1
  };
  public intangibleAssetsPaginator = {
    id: 'tangible_asset_paginator',
    itemsPerPage: 7,
    currentPage: 1
  };
  public attacksPaginator = {
    id: 'attacks_paginator',
    itemsPerPage: 7,
    currentPage: 1
  };
  public mdawTangibleEntities: MdawEntity[];
  public mdawIntangibleEntities: MdawEntity[];
  public orderIntangibleBy: OrderBy;
  public orderTangibleBy: OrderBy;

  private overview: SelfAssessmentOverview;
  // high; medium-high ; medium; medium low; low
  // Likelihood: 5, 4, 3 , 2, 1
  // Vulnerability: 5, 4, 3, 2, 1
  constructor(
    private selfAssessmentService: SelfAssessmentMgmService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.orderTangibleBy = {
      asset: false,
      vulnerability: false,
      likelihood: false,
      attackStrategy: false,
      type: 'desc'
    };
    this.orderIntangibleBy = {
      asset: false,
      vulnerability: false,
      likelihood: false,
      attackStrategy: false,
      type: 'desc'
    };
    this.selfAssessmentService.getOverwiew().toPromise().then((res: SelfAssessmentOverview) => {
      if (res) {
        this.overview = res;
        this.mdawTangibleEntities = [];
        this.mdawIntangibleEntities = [];
        for (const item of this.overview.augmentedMyAssets) {
          if (item.asset.assetcategory.type.toString() === 'TANGIBLE') {
            const index = _.findIndex(this.mdawTangibleEntities, (elem) => {
              return elem.asset.asset.id === item.asset.id;
            });
            if (index === -1) {
              this.mdawTangibleEntities.push(
                _.clone(this.getMostDangerousAttack(item))
              );
            } else {
              continue;
            }
          } else {
            const index = _.findIndex(this.mdawIntangibleEntities, (elem) => {
              return elem.asset.asset.id === item.asset.id;
            });
            if (index === -1) {
              this.mdawIntangibleEntities.push(
                _.clone(this.getMostDangerousAttack(item))
              );
            } else {
              continue;
            }
          }
        }
        this.loading = false;
      }
    });
  }

  private getMostDangerousAttack(augAsset: AugmentedMyAsset): MdawEntity {
    const mdaw = {} as MdawEntity;
    mdaw.mostDangerousAttackValue = {} as {
      likelihood: number,
      vulnerability: number
    };
    let attacks: AugmentedAttackStrategy[] = [];
    for (const item of this.overview.augmentedMyAssets) {
      if (item.asset.id === augAsset.asset.id) {
        attacks.push(item.augmentedAttackStrategy);
      }
    }
    if (attacks[0].refinedLikelihood) {
      attacks = _.orderBy(attacks, ['refinedLikelihood', 'refinedVulnerability'], ['desc', 'desc']);
    } else if (attacks[0].contextualLikelihood) {
      attacks = _.orderBy(attacks, ['contextualLikelihood', 'contextualVulnerability'], ['desc', 'desc']);
    } else {
      attacks = _.orderBy(attacks, ['likelihood'], ['desc']);
    }
    const mostDangerousAttack = attacks[0];
    mdaw.asset = augAsset;
    mdaw.howManyAttacks = attacks.length;
    mdaw.mostDangerousAttack = mostDangerousAttack.name;
    if (mostDangerousAttack.refinedLikelihood) {
      mdaw.mostDangerousAttackValue.likelihood = mostDangerousAttack.refinedLikelihood;
      mdaw.mostDangerousAttackValue.vulnerability = mostDangerousAttack.refinedVulnerability;
    } else if (mostDangerousAttack.contextualLikelihood) {
      mdaw.mostDangerousAttackValue.likelihood = mostDangerousAttack.contextualLikelihood;
      mdaw.mostDangerousAttackValue.vulnerability = mostDangerousAttack.contextualVulnerability;
    } else {
      mdaw.mostDangerousAttackValue.likelihood = mostDangerousAttack.initialLikelihood;
      mdaw.mostDangerousAttackValue.vulnerability = undefined;
    }
    return mdaw;
  }
  onAttacksPageChange(number: number) {
    this.attacksPaginator.currentPage = number;
  }

  onIntangibleAssetsPageChange(number: number) {
    this.intangibleAssetsPaginator.currentPage = number;
  }

  onTangibleAssetsPageChange(number: number) {
    this.tangibleAssetsPaginator.currentPage = number;
  }

  public selectAsset(asset: AugmentedMyAsset) {
    if (this.selectedAsset) {
      if (this.selectedAsset.asset.id === asset.asset.id) {
        this.selectedAsset = null;
        return;
      }
    }
    this.selectedAsset = asset;
    this.selectedAttacks = [];
    this.loadingAttacksTable = true;
    for (const item of this.overview.augmentedMyAssets) {
      if (item.asset.id === this.selectedAsset.asset.id) {
        this.selectedAttacks.push(item.augmentedAttackStrategy);
      }
    }
    if (this.selectedAttacks[0].refinedLikelihood) {
      this.selectedAttacks = _.orderBy(this.selectedAttacks, ['refinedLikelihood', 'refinedVulnerability'], ['desc', 'desc']);
    } else if (this.selectedAttacks[0].contextualLikelihood) {
      this.selectedAttacks = _.orderBy(this.selectedAttacks, ['contextualLikelihood', 'contextualVulnerability'], ['desc', 'desc']);
    } else {
      this.selectedAttacks = _.orderBy(this.selectedAttacks, ['likelihood'], ['desc']);
    }
    this.loadingAttacksTable = false;
  }

  private resetOrder(witchCategory: string) {
    if (witchCategory === 'TANGIBLE') {
      this.orderTangibleBy.asset = false;
      this.orderTangibleBy.vulnerability = false;
      this.orderTangibleBy.likelihood = false;
      this.orderTangibleBy.attackStrategy = false;
      this.orderTangibleBy.type = 'desc';
    } else {
      this.orderIntangibleBy.asset = false;
      this.orderIntangibleBy.vulnerability = false;
      this.orderIntangibleBy.likelihood = false;
      this.orderIntangibleBy.attackStrategy = false;
      this.orderIntangibleBy.type = 'desc';
    }
  }
  public tableOrderBy(orderColumn: string, category: string, desc: boolean) {
    if (category === 'TANGIBLE') {
      this.resetOrder('TANGIBLE');
      if (desc) {
        this.orderTangibleBy.type = 'desc';
      } else {
        this.orderTangibleBy.type = 'asc';
      }
      switch (orderColumn.toLowerCase()) {
        case ('asset'): {
          this.orderTangibleBy.asset = true;
          if (desc) {
            this.mdawTangibleEntities = _.orderBy(this.mdawTangibleEntities, (elem: MdawEntity) => elem.asset.asset.name, ['desc']);
          } else {
            this.mdawTangibleEntities = _.orderBy(this.mdawTangibleEntities, (elem: MdawEntity) => elem.asset.asset.name, ['asc']);
          }
          break;
        }
        case ('vulnerability'): {
          this.orderTangibleBy.vulnerability = true;
          if (desc) {
            this.mdawTangibleEntities = _.orderBy(this.mdawTangibleEntities, (elem: MdawEntity) => elem.mostDangerousAttackValue.vulnerability, ['desc']);
          } else {
            this.mdawTangibleEntities = _.orderBy(this.mdawTangibleEntities, (elem: MdawEntity) => elem.mostDangerousAttackValue.vulnerability, ['asc']);
          }
          break;
        }
        case ('likelihood'): {
          this.orderTangibleBy.likelihood = true;
          if (desc) {
            this.mdawTangibleEntities = _.orderBy(this.mdawTangibleEntities, (elem: MdawEntity) => elem.mostDangerousAttackValue.likelihood, ['desc']);
          } else {
            this.mdawTangibleEntities = _.orderBy(this.mdawTangibleEntities, (elem: MdawEntity) => elem.mostDangerousAttackValue.likelihood, ['asc']);
          }
          break;
        }
        case ('attack_strategy'): {
          this.orderTangibleBy.attackStrategy = true;
          if (desc) {
            this.mdawTangibleEntities = _.orderBy(this.mdawTangibleEntities, (elem: MdawEntity) => elem.howManyAttacks, ['desc']);
          } else {
            this.mdawTangibleEntities = _.orderBy(this.mdawTangibleEntities, (elem: MdawEntity) => elem.howManyAttacks, ['asc']);
          }
          break;
        }
      }
    } else {
      this.resetOrder('INTANGIBLE');
      if (desc) {
        this.orderIntangibleBy.type = 'desc';
      } else {
        this.orderIntangibleBy.type = 'asc';
      }
      switch (orderColumn.toLowerCase()) {
        case ('asset'): {
          this.orderIntangibleBy.asset = true;
          if (desc) {
            this.mdawIntangibleEntities = _.orderBy(this.mdawIntangibleEntities, (elem: MdawEntity) => elem.asset.asset.name, ['desc']);
          } else {
            this.mdawIntangibleEntities = _.orderBy(this.mdawIntangibleEntities, (elem: MdawEntity) => elem.asset.asset.name, ['asc']);
          }
          break;
        }
        case ('vulnerability'): {
          this.orderIntangibleBy.vulnerability = true;
          if (desc) {
            this.mdawIntangibleEntities = _.orderBy(this.mdawIntangibleEntities, (elem: MdawEntity) => elem.mostDangerousAttackValue.vulnerability, ['desc']);
          } else {
            this.mdawIntangibleEntities = _.orderBy(this.mdawIntangibleEntities, (elem: MdawEntity) => elem.mostDangerousAttackValue.vulnerability, ['asc']);
          }
          break;
        }
        case ('likelihood'): {
          this.orderIntangibleBy.likelihood = true;
          if (desc) {
            this.mdawIntangibleEntities = _.orderBy(this.mdawIntangibleEntities, (elem: MdawEntity) => elem.mostDangerousAttackValue.likelihood, ['desc']);
          } else {
            this.mdawIntangibleEntities = _.orderBy(this.mdawIntangibleEntities, (elem: MdawEntity) => elem.mostDangerousAttackValue.likelihood, ['asc']);
          }
          break;
        }
        case ('attack_strategy'): {
          this.orderIntangibleBy.attackStrategy = true;
          if (desc) {
            this.mdawIntangibleEntities = _.orderBy(this.mdawIntangibleEntities, (elem: MdawEntity) => elem.howManyAttacks, ['desc']);
          } else {
            this.mdawIntangibleEntities = _.orderBy(this.mdawIntangibleEntities, (elem: MdawEntity) => elem.howManyAttacks, ['asc']);
          }
          break;
        }
      }
    }
  }

}
