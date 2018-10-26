import * as _ from 'lodash';

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '../../../../../../node_modules/@angular/forms';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { AssetMgmService, AssetMgm } from '../../entities/asset-mgm';
import { AssetType } from '../../entities/enumerations/AssetType.enum';
import { ImpactEvaluationService } from '../impact-evaluation.service';
import { EBITMgm } from '../../entities/ebit-mgm';
import { Wp3BundleInput } from '../model/wp3-bundle-input.model';
import { EconomicCoefficientsMgm } from '../../entities/economic-coefficients-mgm';
import { SectorType, CategoryType } from '../../entities/splitting-loss-mgm';
import { MyCategoryType } from '../../entities/enumerations/MyCategoryType.enum';
import { Router } from '../../../../../../node_modules/@angular/router';
import { MySectorType } from '../../entities/enumerations/MySectorType.enum';
import { ImpactEvaluationStatus } from '../model/impact-evaluation-status.model';
import { AccountService, UserService, User } from '../../shared';
import { MyCompanyMgmService, MyCompanyMgm } from '../../entities/my-company-mgm';
import { HttpResponse } from '@angular/common/http';
import { CompType } from '../../entities/company-profile-mgm';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'impact-evaluation',
  templateUrl: './impact-evaluation.component.html',
  styleUrls: ['./impact-evaluation.component.css']
})
export class ImpactEvaluationComponent implements OnInit {

  public wp3Status: ImpactEvaluationStatus;
  public witchStep = 1;
  public isDescriptionCollapsed = true;
  public isGlobal = true;
  public sectorChoosed: string;
  public selectedCategory: CategoryType;
  public impactFormStepOne: FormGroup;
  public impactFormStepTwo: FormGroup;
  public impactFormStepThree: FormGroup;
  // public impactFormStepFour: FormGroup;

  public economicPerformance: number;
  public intangibleDrivingEarnings: number;
  public intangibleCapitalValuation: number;
  public lossOnintangibleAssetsDueToCyberattacks: number;
  public impactOnOrgCapital: number;
  public impactOnKeyComp: number;
  public impactOnIP: number;
  public impactOnSectorialOrgCapital: number;
  public impactOnSectorialKeyComp: number;
  public impactOnSectorialIP: number;
  public impactOnFinanceAndInsuranceSector: number[];
  public impactOnHealthCareSector: number[];
  public impactOnInformationSector: number[];
  public impactOnProfessionalSector: number[];

  public financialAssetsAkaCurrent: MyAssetMgm[] = [];
  public physicalAssetsAkaFixed: MyAssetMgm[] = [];
  public ebitLabel: string[] = [];

  private mySelf: SelfAssessmentMgm;
  private firstYear: number;
  private lastYear: number;
  private choosedSectorType: SectorType;

  private user: User;
  private myCompany: MyCompanyMgm;

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
    private impactService: ImpactEvaluationService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private accountService: AccountService,
    private userService: UserService,
    private myCompanyService: MyCompanyMgmService,
  ) { }

  ngOnInit() {
    this.accountService.get().subscribe((response1) => {
      const loggedAccount: Account = response1.body;
      this.userService.find(loggedAccount['login']).subscribe((response2) => {
        this.user = response2.body;
        if (this.user) {
          this.myCompanyService.findByUser(this.user.id).subscribe(
            (response3: HttpResponse<MyCompanyMgm>) => {
              this.myCompany = response3.body;
              switch (this.myCompany.companyProfile.type.toString()) {
                case CompType[CompType.FINANCE_AND_INSURANCE]: {
                  this.choosedSectorType = SectorType.FINANCE_AND_INSURANCE;
                  this.sectorChoosed = 'finance_and_insurance';
                  break;
                }
                case CompType[CompType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE]: {
                  this.choosedSectorType = SectorType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE;
                  this.sectorChoosed = 'health_care_and_social_assistance';
                  break;
                }
                case CompType[CompType.INFORMATION]: {
                  this.choosedSectorType = SectorType.INFORMATION;
                  this.sectorChoosed = 'information';
                  break;
                }
                case CompType[CompType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE]: {
                  this.choosedSectorType = SectorType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE;
                  this.sectorChoosed = 'professional_scientific_and_technical_service';
                  break;
                }
                case CompType[CompType.OTHER]: {
                  this.choosedSectorType = SectorType.GLOBAL;
                  this.sectorChoosed = '';
                }
              }
            }
          );
        }
      });
    });
    this.firstYear = (new Date().getFullYear()) - 2;
    this.lastYear = (new Date().getFullYear()) + 3;
    let year = this.firstYear;
    while (year <= this.lastYear) {
      this.ebitLabel.push('Ebit for ' + year.toString());
      year++;
    }
    this.impactFormStepOne = new FormGroup({
      ebit1: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      ebit2: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      ebit3: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      ebit4: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      ebit5: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      ebit6: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      /*
      firstYear: new FormControl(firstYear, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      lastYear: new FormControl(lastYear, Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]')
      ])),
      */
      discountingRate: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(1),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+|[0-1]+')
      ])),
    });
    this.impactFormStepTwo = new FormGroup({
      physicalAssetsReturn: new FormControl(7.1, Validators.compose([
        // Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+|[0-9]+')
      ])),
      financialAssetsReturn: new FormControl(5.0, Validators.compose([
        // Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+|[0-9]+')
      ])),
    });
    this.impactFormStepThree = new FormGroup({
      lossOfIntangiblePercentage: new FormControl(18.29, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+|[0-9]+')
      ])),
    });
    // TODO chiamata per recuperare tutti i MyAssets a partire dal selfAssessment
    this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
    this.impactService.getMyAssets(this.mySelf).toPromise().then((res) => {
      if (res && res.length > 0) {
        // Recuperare tutti i tangible;
        for (const asset of res) {
          if ((asset.asset as AssetMgm).assetcategory.type.toString() === AssetType.TANGIBLE.toString()) {
            if ((asset.asset as AssetMgm).assetcategory.name === 'Current Assets') {
              this.financialAssetsAkaCurrent.push(asset);
            } else if ((asset.asset as AssetMgm).assetcategory.name === 'Fixed Assets') {
              this.physicalAssetsAkaFixed.push(asset);
            }
          }
        }
        // Retrieve the wp3 status from server
        this.impactService.getStatus(this.mySelf).toPromise().then((status) => {
          if (status) {
            this.wp3Status = status;
            this.wp3Status.ebits = _.orderBy(this.wp3Status.ebits, ['year'], ['asc']);
            this.ebitLabel = [];
            let index = 1;
            for (const ebit of this.wp3Status.ebits) {
              this.impactFormStepOne.controls['ebit' + index.toString()].setValue(ebit.value);
              this.ebitLabel.push(ebit.year.toString());
              index++;
            }
            for (const asset of this.wp3Status.myTangibleAssets) {
              const fixedIndex = _.findIndex(this.physicalAssetsAkaFixed, { id: asset.id });
              const currentIndex = _.findIndex(this.financialAssetsAkaCurrent, { id: asset.id });
              if (fixedIndex !== -1) {
                this.physicalAssetsAkaFixed.splice(fixedIndex, 1, _.clone(asset));
              } else if (currentIndex !== -1) {
                this.financialAssetsAkaCurrent.splice(currentIndex, 1, _.clone(asset));
              }
            }
            this.impactFormStepOne.controls['discountingRate'].setValue(this.wp3Status.economicCoefficients.discountingRate);
            this.impactFormStepTwo.controls['physicalAssetsReturn'].setValue(this.wp3Status.economicCoefficients.physicalAssetsReturn);
            this.impactFormStepTwo.controls['financialAssetsReturn'].setValue(this.wp3Status.economicCoefficients.financialAssetsReturn);
            this.impactFormStepThree.controls['lossOfIntangiblePercentage'].setValue(this.wp3Status.economicCoefficients.lossOfIntangible);
            this.choosedSectorType = this.wp3Status.sectorType;
            switch (this.choosedSectorType.toString()) {
              case SectorType[SectorType.FINANCE_AND_INSURANCE]: {
                this.sectorChoosed = 'finance_and_insurance';
                break;
              }
              case SectorType[SectorType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE]: {
                this.sectorChoosed = 'health_care_and_social_assistance';
                break;
              }
              case SectorType[SectorType.INFORMATION]: {
                this.sectorChoosed = 'information';
                break;
              }
              case SectorType[SectorType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE]: {
                this.sectorChoosed = 'professional_scientific_and_technical_service';
                break;
              }
              case SectorType[SectorType.GLOBAL]: {
                this.sectorChoosed = '';
                break;
              }
            }
            this.selectedCategory = this.wp3Status.categoryType;
            this.economicPerformance = this.wp3Status.economicResults.economicPerformance;
            this.intangibleCapitalValuation = this.wp3Status.economicResults.intangibleCapital;
            this.intangibleDrivingEarnings = this.wp3Status.economicResults.intangibleDrivingEarnings;
            this.lossOnintangibleAssetsDueToCyberattacks = this.wp3Status.economicResults.intangibleLossByAttacks;
            for (const impact of this.wp3Status.splittingLosses) {
              switch (impact.categoryType.toString()) {
                case MyCategoryType.IP.toString(): {
                  if (impact.sectorType.toString() === MySectorType.GLOBAL.toString()) {
                    this.impactOnIP = Math.round(impact.loss * 100) / 100;
                  } else {
                    this.impactOnSectorialIP = Math.round(impact.loss * 100) / 100;
                  }
                  break;
                }
                case MyCategoryType.KEY_COMP.toString(): {
                  if (impact.sectorType.toString() === MySectorType.GLOBAL.toString()) {
                    this.impactOnKeyComp = Math.round(impact.loss * 100) / 100;
                  } else {
                    this.impactOnSectorialKeyComp = Math.round(impact.loss * 100) / 100;
                  }
                  break;
                }
                case MyCategoryType.ORG_CAPITAL.toString(): {
                  if (impact.sectorType.toString() === MySectorType.GLOBAL.toString()) {
                    this.impactOnOrgCapital = Math.round(impact.loss * 100) / 100;
                  } else {
                    this.impactOnSectorialOrgCapital = Math.round(impact.loss * 100) / 100;
                  }
                  break;
                }
              }
            }
          }
        });
      }
    });

    // NON PIù NECESSARIO, I PARAMETRI PERCENTUALI SONO PRESTABILITI E NON MODIFICABILI
    /*
    this.impactFormStepFour = new FormGroup({
      globalPercentageIP: new FormControl(19.89, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      globalPercentageKeyComp: new FormControl(42.34, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      globalPercentageOrgCapital: new FormControl(37.77, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
      sectorialPercentage: new FormControl(undefined, Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('[0-9]+,[0-9]+|[0-9]+.[0-9]+')
      ])),
    });
    */
    this.ref.detectChanges();
  }

  public trackByFn(index: number, value: any) {
    return index;
  }

  public evaluateStepOne() {
    console.log('EVALUATE STEP ONE');
    const ebits: EBITMgm[] = [];
    const dataChange = false;
    // prepare ebit 1
    const ebit1: EBITMgm = new EBITMgm();
    ebit1.selfAssessment = this.mySelf;
    ebit1.year = this.firstYear;
    if (String(this.impactFormStepOne.get('ebit1').value).includes(',')) {
      ebit1.value = Math.round(Number((this.impactFormStepOne.get('ebit1').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit1.value = Math.round(Number(this.impactFormStepOne.get('ebit1').value as string) * 100) / 100;
    }
    ebits.push(ebit1);
    // prepare ebit 2
    const ebit2: EBITMgm = new EBITMgm();
    ebit2.selfAssessment = this.mySelf;
    ebit2.year = this.firstYear + 1;
    if (String(this.impactFormStepOne.get('ebit2').value).includes(',')) {
      ebit2.value = Math.round(Number((this.impactFormStepOne.get('ebit2').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit2.value = Math.round(Number(this.impactFormStepOne.get('ebit2').value as string) * 100) / 100;
    }
    ebits.push(ebit2);
    // prepare ebit 3
    const ebit3: EBITMgm = new EBITMgm();
    ebit3.selfAssessment = this.mySelf;
    ebit3.year = this.firstYear + 2;
    if (String(this.impactFormStepOne.get('ebit3').value).includes(',')) {
      ebit3.value = Math.round(Number((this.impactFormStepOne.get('ebit3').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit3.value = Math.round(Number(this.impactFormStepOne.get('ebit3').value as string) * 100) / 100;
    }
    ebits.push(ebit3);
    // prepare ebit 4
    const ebit4: EBITMgm = new EBITMgm();
    ebit4.selfAssessment = this.mySelf;
    ebit4.year = this.firstYear + 3;
    if (String(this.impactFormStepOne.get('ebit4').value).includes(',')) {
      ebit4.value = Math.round(Number((this.impactFormStepOne.get('ebit4').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit4.value = Math.round(Number(this.impactFormStepOne.get('ebit4').value as string) * 100) / 100;
    }
    ebits.push(ebit4);
    // prepare ebit 5
    const ebit5: EBITMgm = new EBITMgm();
    ebit5.selfAssessment = this.mySelf;
    ebit5.year = this.firstYear + 4;
    if (String(this.impactFormStepOne.get('ebit5').value).includes(',')) {
      ebit5.value = Math.round(Number((this.impactFormStepOne.get('ebit5').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit5.value = Math.round(Number(this.impactFormStepOne.get('ebit5').value as string) * 100) / 100;
    }
    ebits.push(ebit5);
    // prepare ebit 6
    const ebit6: EBITMgm = new EBITMgm();
    ebit6.selfAssessment = this.mySelf;
    ebit6.year = this.firstYear + 5;
    if (String(this.impactFormStepOne.get('ebit6').value).includes(',')) {
      ebit6.value = Math.round(Number((this.impactFormStepOne.get('ebit6').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      ebit6.value = Math.round(Number(this.impactFormStepOne.get('ebit6').value as string) * 100) / 100;
    }
    ebits.push(ebit5);
    // prepare discounting rate
    let discounting: number;
    if (String(this.impactFormStepOne.get('discountingRate').value).includes(',')) {
      discounting = Math.round(Number((this.impactFormStepOne.get('discountingRate').value as string).replace(/,/g, '.')) * 100) / 100;
    } else {
      discounting = Math.round(Number(this.impactFormStepOne.get('discountingRate').value as string) * 100) / 100;
    }
    if (ebits.length === 6 && discounting) {
      const inputs: Wp3BundleInput = new Wp3BundleInput();
      inputs.ebits = ebits;
      inputs.economicCoefficients = new EconomicCoefficientsMgm();
      inputs.economicCoefficients.discountingRate = discounting;
      console.log(inputs);
      this.impactService.evaluateStepOne(inputs, this.mySelf).toPromise().then((res) => {
        if (res) {
          this.economicPerformance = Math.round(res.economicResults.economicPerformance * 100) / 100;
        }
      });
      // this.economicPerformance = Math.random() * 100;
    }
  }
  public evaluateStepTwo() {
    console.log('EVALUATE STEP TWO');
    let dataIsOk = true;
    for (const asset of this.physicalAssetsAkaFixed) {
      if (isNaN(parseFloat(asset.economicValue.toString()))) {
        dataIsOk = false;
      }
    }
    for (const asset of this.financialAssetsAkaCurrent) {
      if (isNaN(parseFloat(asset.economicValue.toString()))) {
        dataIsOk = false;
      }
    }
    if (!dataIsOk) {
      return;
    }
    let physicalAssetsReturn = 7.1;
    let financialAssetsReturn = 5.0;
    if (this.impactFormStepTwo.get('physicalAssetsReturn').value &&
      !isNaN(parseFloat(this.impactFormStepTwo.get('physicalAssetsReturn').value))) {
      if (String(this.impactFormStepTwo.get('physicalAssetsReturn').value).includes(',')) {
        physicalAssetsReturn = Math.round(Number((this.impactFormStepTwo.get('physicalAssetsReturn').value as string).replace(/,/g, '.')) * 100) / 100;
      } else {
        physicalAssetsReturn = Math.round(Number(this.impactFormStepTwo.get('physicalAssetsReturn').value as string) * 100) / 100;
      }
    }
    if (this.impactFormStepTwo.get('financialAssetsReturn').value &&
      !isNaN(parseFloat(this.impactFormStepTwo.get('financialAssetsReturn').value))) {
      if (String(this.impactFormStepTwo.get('financialAssetsReturn').value).includes(',')) {
        financialAssetsReturn = Math.round(Number(String(this.impactFormStepTwo.get('financialAssetsReturn').value).replace(/,/g, '.')) * 100) / 100;
      } else {
        financialAssetsReturn = Math.round(Number(String(this.impactFormStepTwo.get('financialAssetsReturn').value)) * 100) / 100;
      }
    }
    if (this.financialAssetsAkaCurrent && this.physicalAssetsAkaFixed && financialAssetsReturn && physicalAssetsReturn) {
      const inputs: Wp3BundleInput = new Wp3BundleInput();
      inputs.economicCoefficients = new EconomicCoefficientsMgm();
      inputs.economicCoefficients.physicalAssetsReturn = physicalAssetsReturn;
      inputs.economicCoefficients.financialAssetsReturn = financialAssetsReturn;
      inputs.myAssets = [];
      inputs.myAssets = this.financialAssetsAkaCurrent.concat(this.physicalAssetsAkaFixed);
      console.log(inputs);
      this.impactService.evaluateStepTwo(inputs, this.mySelf).toPromise().then((res) => {
        if (res) {
          this.intangibleDrivingEarnings = Math.round(res.economicResults.intangibleDrivingEarnings * 100) / 100;
          this.intangibleCapitalValuation = Math.round(res.economicResults.intangibleCapital * 100) / 100;
        }
      });
    }
  }
  public evaluateStepThree() {
    if (this.impactFormStepThree.invalid) {
      // gestire l'errore con un messaggio sul campo input
      return;
    }
    console.log('EVALUATE STEP THREE');
    let lossOfIntangiblePercentage = 18.29;
    if (this.impactFormStepThree.get('lossOfIntangiblePercentage').value &&
      !isNaN(parseFloat(this.impactFormStepThree.get('lossOfIntangiblePercentage').value))) {
      if (String(this.impactFormStepThree.get('lossOfIntangiblePercentage').value).includes(',')) {
        lossOfIntangiblePercentage = Math.round(Number((this.impactFormStepThree.get('lossOfIntangiblePercentage').value as string).replace(/,/g, '.')) * 100) / 100;
      } else {
        lossOfIntangiblePercentage = Math.round(Number(this.impactFormStepThree.get('lossOfIntangiblePercentage').value as string) * 100) / 100;
      }
    }
    if (lossOfIntangiblePercentage) {
      const inputs: Wp3BundleInput = new Wp3BundleInput();
      inputs.economicCoefficients = new EconomicCoefficientsMgm();
      inputs.economicCoefficients.lossOfIntangible = lossOfIntangiblePercentage;
      console.log(inputs);
      this.impactService.evaluateStepThree(inputs, this.mySelf).toPromise().then((res) => {
        if (res) {
          this.lossOnintangibleAssetsDueToCyberattacks = Math.round(res.economicResults.intangibleLossByAttacks * 100) / 100;
        }
      });
    }
    // Next call is present because we chose of collapse step 3 and 4 in same view
    this.evaluateStepFour();
  }

  public evaluateStepFour() {
    console.log('EVALUATE STEP FOUR');
    /*
    if (this.impactFormStepFour.invalid) {
      // gestire l'errore
      return;
    }
    */
    const inputs: Wp3BundleInput = new Wp3BundleInput();
    if (!this.choosedSectorType) {
      inputs.sectorType = SectorType.GLOBAL;
    } else {
      inputs.sectorType = this.choosedSectorType;
    }
    console.log(inputs);
    this.impactService.evaluateStepFour(inputs, this.mySelf).toPromise().then((res) => {
      if (res) {
        // 6 elementi 3 per global e 3 per sector
        for (const impactOn of res.splittingLosses) {
          switch (impactOn.categoryType.toString()) {
            case MyCategoryType.IP.toString(): {
              if (impactOn.sectorType.toString() === MySectorType.GLOBAL.toString()) {
                this.impactOnIP = Math.round(impactOn.loss * 100) / 100;
              } else {
                this.impactOnSectorialIP = Math.round(impactOn.loss * 100) / 100;
              }
              break;
            }
            case MyCategoryType.KEY_COMP.toString(): {
              if (impactOn.sectorType.toString() === MySectorType.GLOBAL.toString()) {
                this.impactOnKeyComp = Math.round(impactOn.loss * 100) / 100;
              } else {
                this.impactOnSectorialKeyComp = Math.round(impactOn.loss * 100) / 100;
              }
              break;
            }
            case MyCategoryType.ORG_CAPITAL.toString(): {
              if (impactOn.sectorType.toString() === MySectorType.GLOBAL.toString()) {
                this.impactOnOrgCapital = Math.round(impactOn.loss * 100) / 100;
              } else {
                this.impactOnSectorialOrgCapital = Math.round(impactOn.loss * 100) / 100;
              }
              break;
            }
          }
        }
      }
    });
    /*
    this.impactOnOrgCapital = Math.random() * 100;
    this.impactOnKeyComp = Math.random() * 100;
    this.impactOnIP = Math.random() * 100;
    */
  }

  public isSectorSelected(sector: string): boolean {
    if (this.sectorChoosed === sector) {
      return true;
    }
    return false;
  }

  public selectStep(step: number) {
    this.isDescriptionCollapsed = true;
    switch (step) {
      case 2: {
        if (this.impactFormStepOne.invalid) {
          return;
        }
        this.evaluateStepOne();
        break;
      }
      case 3: {
        if (this.impactFormStepTwo.invalid) {
          return;
        }
        this.evaluateStepTwo();
        if (this.isGlobal) {
          this.evaluateStepFour();
        }
        break;
      }
      /*
      case 4: {
        if (this.impactFormStepThree.invalid) {
          return;
        }
        this.evaluateStepThree();
        if (this.isGlobal) {
          this.evaluateStepFour();
        }
        break;
      }
      */
    }
    this.witchStep = step;
  }

  public setIsGlobal() {
    this.isGlobal = !this.isGlobal;
    if (this.isGlobal) {
      this.evaluateStepFour();
    } else {
      this.resetStepFourRes();
    }
  }

  private resetStepFourRes() {
    this.choosedSectorType = null;
    this.impactOnOrgCapital = undefined;
    this.impactOnKeyComp = undefined;
    this.impactOnIP = undefined;
  }

  public setSector(sector: string) {
    this.sectorChoosed = sector;
    switch (sector) {
      case 'finance_and_insurance': {
        this.choosedSectorType = SectorType.FINANCE_AND_INSURANCE;
        break;
      }
      case 'health_care_and_social_assistance': {
        this.choosedSectorType = SectorType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE;
        break;
      }
      case 'information': {
        this.choosedSectorType = SectorType.INFORMATION;
        break;
      }
      case 'professional_scientific_and_technical_service': {
        this.choosedSectorType = SectorType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE;
        break;
      }
    }
    this.evaluateStepFour();
  }

  public close() {
    this.router.navigate(['/dashboard']);
  }
}
