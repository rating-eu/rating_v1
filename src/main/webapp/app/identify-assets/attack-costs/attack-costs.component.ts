import { JhiAlertService } from 'ng-jhipster';
import { Router } from '@angular/router';
import { IndirectAssetMgm } from './../../entities/indirect-asset-mgm/indirect-asset-mgm.model';
import { MyCostType } from './../model/enumeration/AttackCostType.enum';
import { AttackCostMgm, CostType } from './../../entities/attack-cost-mgm/attack-cost-mgm.model';
import * as _ from 'lodash';
import { DirectAssetMgm } from './../../entities/direct-asset-mgm/direct-asset-mgm.model';
import { SelfAssessmentMgmService } from './../../entities/self-assessment-mgm/self-assessment-mgm.service';
import { IdentifyAssetUtilService } from './../identify-asset.util.service';
import { MyAssetMgm } from './../../entities/my-asset-mgm/my-asset-mgm.model';
import { SelfAssessmentMgm } from './../../entities/self-assessment-mgm/self-assessment-mgm.model';
import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'attack-costs',
  templateUrl: './attack-costs.component.html',
  styleUrls: ['./attack-costs.component.css'],
})

export class AttackCostsComponent implements OnInit {
  private mySelf: SelfAssessmentMgm = {};
  public myAssets: MyAssetMgm[];
  public myDirects: DirectAssetMgm[];
  public selectedDirectAsset: DirectAssetMgm;
  public selectedIndirectAsset: IndirectAssetMgm;
  public isMyAssetUpdated = false;
  public isDescriptionCollapsed = true;
  public loading = false;
  public costs: string[] = [
    'Before the attack status restoration',
    'Increased security',
    'Legal litigation costs and attorney fees',
    'Notification and regulatory compliance costs',
    'Liability costs',
    'Customer breach notification costs',
    'Post breach customer protection or care costs',
    'Lost customers recovery',
    'Public relations',
    'Increase of insurance premiums',
    'Loss of revenues',
    'Increased cost to raise debt',
    'Value of lost or not fulfilled contract revenues',
    'Lost or non fulfilled contracts'
  ];

  constructor(
    private idaUtilsService: IdentifyAssetUtilService,
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private router: Router,
    private jhiAlertService: JhiAlertService,
  ) {

  }

  ngOnInit(): void {
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.idaUtilsService.getMySavedAssets(this.mySelf).toPromise().then((mySavedAssets) => {
      if (mySavedAssets) {
        this.myAssets = mySavedAssets;
      }
    });
    this.idaUtilsService.getMySavedDirectAssets(this.mySelf).toPromise().then((mySavedDirect) => {
      if (mySavedDirect) {
        this.myDirects = mySavedDirect;
      }
    });
  }

  public selectIndirect(myIndirect: IndirectAssetMgm) {
    if (myIndirect) {
      if (this.selectedIndirectAsset) {
        if (this.selectedIndirectAsset.id === myIndirect.id) {
          this.selectedIndirectAsset = null;
        } else {
          this.selectedIndirectAsset = myIndirect;
        }
      } else {
        this.selectedIndirectAsset = myIndirect;
      }
    }
  }

  public selectDirect(myDirect: DirectAssetMgm) {
    if (myDirect) {
      this.selectedIndirectAsset = null;
      if (this.selectedDirectAsset) {
        if (this.selectedDirectAsset.id === myDirect.id) {
          this.selectedDirectAsset = null;
        } else {
          this.selectedDirectAsset = myDirect;
        }
      } else {
        this.selectedDirectAsset = myDirect;
      }
    }
  }

  public setCostOnDirect(cost: string) {
    if (cost) {
      if (!this.selectedDirectAsset.costs) {
        this.selectedDirectAsset.costs = [];
      }
      let selectedCost: CostType;
      switch (cost) {
        case MyCostType.BEFORE_THE_ATTACK_STATUS_RESTORATION.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.BEFORE_THE_ATTACK_STATUS_RESTORATION.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.BEFORE_THE_ATTACK_STATUS_RESTORATION;
            break;
          }
        case MyCostType.CUSTOMER_BREACH_NOTIFICATION_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.CUSTOMER_BREACH_NOTIFICATION_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS;
            break;
          }
        case MyCostType.INCREASED_COST_TO_RAISE_DEBT.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASED_COST_TO_RAISE_DEBT.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASED_COST_TO_RAISE_DEBT;
            break;
          }
        case MyCostType.INCREASED_SECURITY.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASED_SECURITY.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASED_SECURITY;
            break;
          }
        case MyCostType.INCREASE_OF_INSURANCE_PREMIUMS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASE_OF_INSURANCE_PREMIUMS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASE_OF_INSURANCE_PREMIUMS;
            break;
          }
        case MyCostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES;
            break;
          }
        case MyCostType.LIABILITY_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LIABILITY_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LIABILITY_COSTS;
            break;
          }
        case MyCostType.LOSS_OF_REVENUES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOSS_OF_REVENUES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOSS_OF_REVENUES;
            break;
          }
        case MyCostType.LOST_CUSTOMERS_RECOVERY.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOST_CUSTOMERS_RECOVERY.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOST_CUSTOMERS_RECOVERY;
            break;
          }
        case MyCostType.LOST_OR_NON_FULFILLED_CONTRACTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOST_OR_NON_FULFILLED_CONTRACTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOST_OR_NON_FULFILLED_CONTRACTS;
            break;
          }
        case MyCostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS;
            break;
          }
        case MyCostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS;
            break;
          }
        case MyCostType.PUBLIC_RELATIONS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.PUBLIC_RELATIONS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.PUBLIC_RELATIONS;
            break;
          }
        case MyCostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES;
            break;
          }
      }
      this.isMyAssetUpdated = true;
      const index = _.findIndex(this.selectedDirectAsset.costs, { type: selectedCost });
      if (index !== -1) {
        this.selectedDirectAsset.costs.splice(index, 1);
      } else {
        const newCost = new AttackCostMgm();
        newCost.directAsset = this.selectedDirectAsset;
        newCost.type = selectedCost;
        this.selectedDirectAsset.costs.push(_.cloneDeep(newCost));
      }
    }
  }

  public isDirectCostSelected(cost: string): boolean {
    if (cost) {
      if (!this.selectedDirectAsset.costs) {
        return false;
      }
      let selectedCost: CostType;
      switch (cost) {
        case MyCostType.BEFORE_THE_ATTACK_STATUS_RESTORATION.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.BEFORE_THE_ATTACK_STATUS_RESTORATION.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.BEFORE_THE_ATTACK_STATUS_RESTORATION;
            break;
          }
        case MyCostType.CUSTOMER_BREACH_NOTIFICATION_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.CUSTOMER_BREACH_NOTIFICATION_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS;
            break;
          }
        case MyCostType.INCREASED_COST_TO_RAISE_DEBT.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASED_COST_TO_RAISE_DEBT.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASED_COST_TO_RAISE_DEBT;
            break;
          }
        case MyCostType.INCREASED_SECURITY.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASED_SECURITY.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASED_SECURITY;
            break;
          }
        case MyCostType.INCREASE_OF_INSURANCE_PREMIUMS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASE_OF_INSURANCE_PREMIUMS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASE_OF_INSURANCE_PREMIUMS;
            break;
          }
        case MyCostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES;
            break;
          }
        case MyCostType.LIABILITY_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LIABILITY_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LIABILITY_COSTS;
            break;
          }
        case MyCostType.LOSS_OF_REVENUES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOSS_OF_REVENUES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOSS_OF_REVENUES;
            break;
          }
        case MyCostType.LOST_CUSTOMERS_RECOVERY.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOST_CUSTOMERS_RECOVERY.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOST_CUSTOMERS_RECOVERY;
            break;
          }
        case MyCostType.LOST_OR_NON_FULFILLED_CONTRACTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOST_OR_NON_FULFILLED_CONTRACTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOST_OR_NON_FULFILLED_CONTRACTS;
            break;
          }
        case MyCostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS;
            break;
          }
        case MyCostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS;
            break;
          }
        case MyCostType.PUBLIC_RELATIONS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.PUBLIC_RELATIONS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.PUBLIC_RELATIONS;
            break;
          }
        case MyCostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES;
            break;
          }
      }
      for (const iCost of this.selectedDirectAsset.costs) {
        if (iCost.type.toString() === (CostType[selectedCost] as String)) {
          return true;
        }
      }
    }
    return false;
  }

  public setCostOnIndirect(cost: string) {
    if (cost) {
      if (!this.selectedIndirectAsset.costs) {
        this.selectedIndirectAsset.costs = [];
      }
      let selectedCost: CostType;
      switch (cost) {
        case MyCostType.BEFORE_THE_ATTACK_STATUS_RESTORATION.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.BEFORE_THE_ATTACK_STATUS_RESTORATION.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.BEFORE_THE_ATTACK_STATUS_RESTORATION;
            break;
          }
        case MyCostType.CUSTOMER_BREACH_NOTIFICATION_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.CUSTOMER_BREACH_NOTIFICATION_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS;
            break;
          }
        case MyCostType.INCREASED_COST_TO_RAISE_DEBT.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASED_COST_TO_RAISE_DEBT.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASED_COST_TO_RAISE_DEBT;
            break;
          }
        case MyCostType.INCREASED_SECURITY.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASED_SECURITY.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASED_SECURITY;
            break;
          }
        case MyCostType.INCREASE_OF_INSURANCE_PREMIUMS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASE_OF_INSURANCE_PREMIUMS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASE_OF_INSURANCE_PREMIUMS;
            break;
          }
        case MyCostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES;
            break;
          }
        case MyCostType.LIABILITY_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LIABILITY_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LIABILITY_COSTS;
            break;
          }
        case MyCostType.LOSS_OF_REVENUES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOSS_OF_REVENUES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOSS_OF_REVENUES;
            break;
          }
        case MyCostType.LOST_CUSTOMERS_RECOVERY.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOST_CUSTOMERS_RECOVERY.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOST_CUSTOMERS_RECOVERY;
            break;
          }
        case MyCostType.LOST_OR_NON_FULFILLED_CONTRACTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOST_OR_NON_FULFILLED_CONTRACTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOST_OR_NON_FULFILLED_CONTRACTS;
            break;
          }
        case MyCostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS;
            break;
          }
        case MyCostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS;
            break;
          }
        case MyCostType.PUBLIC_RELATIONS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.PUBLIC_RELATIONS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.PUBLIC_RELATIONS;
            break;
          }
        case MyCostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES;
            break;
          }
      }
      this.isMyAssetUpdated = true;
      const index = _.findIndex(this.selectedIndirectAsset.costs, { type: selectedCost });
      if (index !== -1) {
        this.selectedIndirectAsset.costs.splice(index, 1);
      } else {
        const newCost = new AttackCostMgm();
        newCost.indirectAsset = this.selectedIndirectAsset;
        newCost.type = selectedCost;
        this.selectedIndirectAsset.costs.push(_.cloneDeep(newCost));
      }
      const iIndex = _.findIndex(this.selectedDirectAsset.effects, { id: this.selectedIndirectAsset.id });
      if (iIndex !== -1) {
        this.selectedDirectAsset.effects.splice(iIndex, 1, this.selectedIndirectAsset);
      }
    }
  }

  public isIndirectCostSelected(cost: string): boolean {
    if (cost) {
      if (!this.selectedIndirectAsset.costs) {
        return false;
      }
      let selectedCost: CostType;
      switch (cost) {
        case MyCostType.BEFORE_THE_ATTACK_STATUS_RESTORATION.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.BEFORE_THE_ATTACK_STATUS_RESTORATION.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.BEFORE_THE_ATTACK_STATUS_RESTORATION;
            break;
          }
        case MyCostType.CUSTOMER_BREACH_NOTIFICATION_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.CUSTOMER_BREACH_NOTIFICATION_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.CUSTOMER_BREACH_NOTIFICATION_COSTS;
            break;
          }
        case MyCostType.INCREASED_COST_TO_RAISE_DEBT.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASED_COST_TO_RAISE_DEBT.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASED_COST_TO_RAISE_DEBT;
            break;
          }
        case MyCostType.INCREASED_SECURITY.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASED_SECURITY.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASED_SECURITY;
            break;
          }
        case MyCostType.INCREASE_OF_INSURANCE_PREMIUMS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.INCREASE_OF_INSURANCE_PREMIUMS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.INCREASE_OF_INSURANCE_PREMIUMS;
            break;
          }
        case MyCostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LEGAL_LITIGATION_COSTS_AND_ATTORNEY_FEES;
            break;
          }
        case MyCostType.LIABILITY_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LIABILITY_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LIABILITY_COSTS;
            break;
          }
        case MyCostType.LOSS_OF_REVENUES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOSS_OF_REVENUES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOSS_OF_REVENUES;
            break;
          }
        case MyCostType.LOST_CUSTOMERS_RECOVERY.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOST_CUSTOMERS_RECOVERY.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOST_CUSTOMERS_RECOVERY;
            break;
          }
        case MyCostType.LOST_OR_NON_FULFILLED_CONTRACTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.LOST_OR_NON_FULFILLED_CONTRACTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.LOST_OR_NON_FULFILLED_CONTRACTS;
            break;
          }
        case MyCostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.NOTIFICATION_AND_REGULATORY_COMPLIANCE_COSTS;
            break;
          }
        case MyCostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.POST_BREACH_CUSTOMER_PROTECTION_OR_CARE_COSTS;
            break;
          }
        case MyCostType.PUBLIC_RELATIONS.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.PUBLIC_RELATIONS.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.PUBLIC_RELATIONS;
            break;
          }
        case MyCostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES.toString().replace('_', ' ').substring(0, 1) +
          MyCostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES.toString().replace('_', ' ').substring(1).toLowerCase(): {
            selectedCost = CostType.VALUE_OF_LOST_OR_NOT_FULFILLED_CONTRACT_REVENUES;
            break;
          }
      }
      for (const iCost of this.selectedIndirectAsset.costs) {
        if (iCost.type.toString() === (CostType[selectedCost] as String)) {
          return true;
        }
      }
    }
    return false;
  }

  public updateMyAsset() {
    console.log(this.selectedDirectAsset);
    this.loading = true;
    this.idaUtilsService.updateDirectAsset(this.selectedDirectAsset).toPromise().then((myDirectAsset) => {
      if (myDirectAsset) {
        this.selectedDirectAsset = myDirectAsset;
        if (this.selectedIndirectAsset) {
          const indIndex = _.findIndex(this.selectedDirectAsset.effects, { id: this.selectedIndirectAsset.id });
          if (indIndex !== -1) {
            this.selectedIndirectAsset = this.selectedDirectAsset.effects[indIndex];
          }
        }
        const index = _.findIndex(this.myDirects, { id: this.selectedDirectAsset.id });
        if (index !== -1) {
          this.myDirects.splice(index, 1, this.selectedDirectAsset);
        } else {
          this.myDirects.push(_.cloneDeep(this.selectedDirectAsset));
        }
        this.isMyAssetUpdated = false;
        this.loading = false;
        this.jhiAlertService.success('hermeneutApp.messages.saved', null, null);
      }
    }).catch(() => {
      this.loading = false;
      this.jhiAlertService.error('hermeneutApp.messages.error', null, null);
    });
  }

}
