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
  public assetsPaginator = {
    id: 'asset_paginator',
    itemsPerPage: 7,
    currentPage: 1
  };
  public attacksPaginator = {
    id: 'attacks_paginator',
    itemsPerPage: 7,
    currentPage: 1
  };
  public mdawEntities: MdawEntity[];

  private overview: SelfAssessmentOverview;
  // high; medium-high ; medium; medium low; low
  // Likelihood: 5, 4, 3 , 2, 1
  // Vulnerability: 5, 4, 3, 2, 1
  constructor(
    private selfAssessmentService: SelfAssessmentMgmService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.selfAssessmentService.getOverwiew().toPromise().then((res: SelfAssessmentOverview) => {
      if (res) {
        this.overview = res;
        this.mdawEntities = [];
        for (const item of this.overview.augmentedMyAssets) {
          const index = _.findIndex(this.mdawEntities, (elem) => {
            return elem.asset.asset.id === item.asset.id;
          });
          if (index === -1) {
            this.mdawEntities.push(
              _.clone(this.getMostDangerousAttack(item))
            );
          } else {
            continue;
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

  onAssetsPageChange(number: number) {
    this.assetsPaginator.currentPage = number;
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

}
