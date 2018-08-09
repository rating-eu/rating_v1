import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '../../../../../../node_modules/@angular/forms';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { AssetMgmService, AssetMgm } from '../../entities/asset-mgm';
import { AssetType } from '../../entities/enumerations/AssetType.enum';

@Component({
  selector: 'jhi-inpact-evaluation',
  templateUrl: './impact-evaluation.component.html',
  styles: []
})
export class ImpactEvaluationComponent implements OnInit {

  public impactFormStepOne: FormGroup;
  public impactFormStepTwo: FormGroup;
  public impactFormStepThree: FormGroup;
  public impactFormStepFour: FormGroup;

  public intangibleDrivingEarnings: number;
  public intangibleCapitalValuation: number;
  public lossOnintangibleAssetsDueToCyberattacks: number;
  public impactOnOrgCapital: number;
  public impactOnKeyComp: number;
  public impactOnIP: number;
  public impactOnFinanceAndInsuranceSector: number[];
  public impactOnHealthCareSector: number[];
  public impactOnInformationSector: number[];
  public impactOnProfessionalSector: number[];

  public tangibleAssets: MyAssetMgm[] = [];
  private mySelf: SelfAssessmentMgm;

  public sectorialPercentageMatrix: any[] = [
    {
      ipSectorialPercentage: [] = [
        { financeAmdInsurence: 13.6 },
        { healthCareAndSocialAssistance: 14.7 },
        { information: 27.5 },
        { professionalScientificAndTechnicalService: 6.1 }
      ],
      keyCompSectorialPercentage: [] = [
        { financeAmdInsurence: 45.3 },
        { healthCareAndSocialAssistance: 63.3 },
        { information: 27.8 },
        { professionalScientificAndTechnicalService: 53.7 }
      ],
      orgCapitalSectorialPercentage: [] = [
        { financeAmdInsurence: 41.1 },
        { healthCareAndSocialAssistance: 22 },
        { information: 44.7 },
        { professionalScientificAndTechnicalService: 40.2 }
      ],
    }
  ];
  constructor(
    private mySelfAssessmentService: SelfAssessmentMgmService,
    private assetService: AssetMgmService
  ) { }

  ngOnInit() {
    const firstYear = (new Date().getFullYear()) - 2;
    const lastYear = (new Date().getFullYear()) + 3;
    // TODO chiamata per recuperare tutti i MyAssets a partire dal selfAssessment
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    // const myAssets = this.assetService.getAllBySelf(this.mySelf.id);
    const myAssets: MyAssetMgm[] = [];
    // Recuperare tutti gli intangible;
    for (const asset of myAssets) {
      if ((asset.asset as AssetMgm).assetcategory.type.toString() === AssetType.TANGIBLE.toString()) {
        this.tangibleAssets.push(asset);
      }
    }
    this.tangibleAssets = [];
    this.impactFormStepOne = new FormGroup({
      ebit1: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      ebit2: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      ebit3: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      ebit4: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      ebit5: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      ebit6: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      firstYear: new FormControl(firstYear, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      lastYear: new FormControl(lastYear, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      discountingRate: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
    });
    this.impactFormStepTwo = new FormGroup({
      physicalAssetsReturn: new FormControl(7.1, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      financialAssetsReturn: new FormControl(5, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
    });
    this.impactFormStepThree = new FormGroup({
      lossOfIntangiblePercentage: new FormControl(18.29, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
    });
    this.impactFormStepFour = new FormGroup({
      globalPercentageIP: new FormControl(19.89, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      globalPercentageKeyComp: new FormControl(42.34, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      globalPercentageOrgCapital: new FormControl(37.77, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      sectorialPercentage: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
    });
  }

  public evaluateStepOne() {
    const value = this.impactFormStepOne.get('ebit1').value;
  }
  public evaluateStepTwo() {

  }
  public evaluateStepThree() {

  }
  public evaluateStepFour() {

  }
}
