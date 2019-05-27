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

import {IdentifyAssetUtilService} from '../../../identify-assets/identify-asset.util.service';
import {Priority} from '../../../identify-assets/model/enumeration/priority.enum';
import * as _ from 'lodash';

import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {SelfAssessmentMgmService, SelfAssessmentMgm} from '../../../entities/self-assessment-mgm';
import {MyAssetMgm} from '../../../entities/my-asset-mgm';
import {AssetMgm} from '../../../entities/asset-mgm';
import {AssetType} from '../../../entities/enumerations/AssetType.enum';
import {ImpactEvaluationService} from '../../impact-evaluation.service';
import {EBITMgm} from '../../../entities/ebit-mgm';
import {Wp3BundleInput} from '../model/wp3-bundle-input.model';
import {EconomicCoefficientsMgm} from '../../../entities/economic-coefficients-mgm';
import {Router, NavigationStart} from '@angular/router';
import {ImpactEvaluationStatus} from '../model/impact-evaluation-status.model';
import {AccountService, UserService, User} from '../../../shared';
import {MyCompanyMgmService, MyCompanyMgm} from '../../../entities/my-company-mgm';
import {HttpResponse} from '@angular/common/http';
import {RegExpUtility} from '../../../utils/regexp.utility.class';
import {Wp3BundleOutput} from '../model/wp3-bundle-output.model';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {DatasharingService} from '../../../datasharing/datasharing.service';
import {Account} from '../../../shared';
import {CompanyType} from '../../../entities/enumerations/CompanyType.enum';
import {SectorType} from '../../../entities/enumerations/SectorTyep.enum';
import {CategoryType} from '../../../entities/enumerations/CategoryType.enum';

interface OrderBy {
    asset: boolean;
    priority: boolean;
    value: boolean;
    valueLoss: boolean;
    type: string;
}

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
    public impactFormStepOne: FormGroup;
    public impactFormStepTwo: FormGroup;
    public impactFormStepThree: FormGroup;
    public collapseSplittings = true;
    public collapseLosses = true;
    public assetsBySelectedCategory: MyAssetMgm[] = [];
    public myAssets: MyAssetMgm[] = [];
    public selectedAssetCategory: string;
    public selectedAssetSplitting: number;
    public selectedAssetLosses: number;
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
    public splittingOnIP: number;
    public splittingOnKeyComp: number;
    public splittingOnOrgCapital: number;
    public splittingOnSectorialIP: number;
    public splittingOnSectorialKeyComp: number;
    public splittingOnSectorialOrgCapital: number;
    public financialAssetsAkaCurrent: MyAssetMgm[] = [];
    public physicalAssetsAkaFixed: MyAssetMgm[] = [];
    public ebitLabel: string[] = [];
    public orderBy: OrderBy;

    private mySelf: SelfAssessmentMgm;
    private firstYear: number;
    private lastYear: number;
    private choosedSectorType: SectorType;
    private user: User;
    private myCompany: MyCompanyMgm;
    public priorities = ['Low', 'Low medium', 'Medium', 'Medium high', 'High'];
    public sectorString: string;

    public sectorChoosed: string;
    private selectedCategory: CategoryType;
    private selectedAssetCategoryCode: string;

    public discountingRate = 10;
    public physicalAssetsReturn = 7.1;
    public financialAssetsReturn = 5.0;
    public lossOfIntangiblePercentage = 18.29;
    public longTermLiabilities: number;
    public currentLiabilities: number;

    constructor(
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private impactService: ImpactEvaluationService,
        private router: Router,
        private accountService: AccountService,
        private userService: UserService,
        private myCompanyService: MyCompanyMgmService,
        private idaUtilService: IdentifyAssetUtilService,
        private dataSharingService: DatasharingService
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (this.mySelf) {
                    console.log('Send start impacts Evaluation request!');
                    this.impactService.getImpacts(this.mySelf).toPromise();
                }
            }
        });
    }

    ngOnInit() {
        this.orderBy = {
            asset: false,
            priority: false,
            value: false,
            valueLoss: false,
            type: 'desc'
        };
        this.accountService.get().subscribe((response1) => {
            const loggedAccount: Account = response1.body;
            this.userService.find(loggedAccount['login']).subscribe((response2) => {
                this.user = response2.body;
                if (this.user) {
                    this.myCompanyService.findByUser(this.user.id).subscribe(
                        (response3: HttpResponse<MyCompanyMgm>) => {
                            this.myCompany = response3.body;
                            switch (this.myCompany.companyProfile.type) {
                                case CompanyType.FINANCE_AND_INSURANCE: {
                                    this.choosedSectorType = SectorType.FINANCE_AND_INSURANCE;
                                    this.sectorChoosed = 'finance_and_insurance';
                                    this.sectorString = 'Finance and Insurance';
                                    break;
                                }
                                case CompanyType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE: {
                                    this.choosedSectorType = SectorType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE;
                                    this.sectorChoosed = 'health_care_and_social_assistance';
                                    this.sectorString = 'Health care and social assistance';
                                    break;
                                }
                                case CompanyType.INFORMATION: {
                                    this.choosedSectorType = SectorType.INFORMATION;
                                    this.sectorChoosed = 'information';
                                    this.sectorString = 'Information';
                                    break;
                                }
                                case CompanyType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE: {
                                    this.choosedSectorType = SectorType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE;
                                    this.sectorChoosed = 'professional_scientific_and_technical_service';
                                    this.sectorString = 'Professional Scientific and Technical Service';
                                    break;
                                }
                                case CompanyType.OTHER: {
                                    this.choosedSectorType = SectorType.GLOBAL;
                                    this.sectorChoosed = '';
                                    this.sectorString = '';
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
            this.ebitLabel.push('EBITDA for ' + year.toString());
            year++;
        }
        this.impactFormStepOne = new FormGroup({
            ebit1: new FormControl(undefined, Validators.compose([
                Validators.required,
                Validators.min(0)
            ])),
            ebit2: new FormControl(undefined, Validators.compose([
                Validators.required,
                Validators.min(0)
            ])),
            ebit3: new FormControl(undefined, Validators.compose([
                Validators.required,
                Validators.min(0)
            ])),
            ebit4: new FormControl(undefined, Validators.compose([
                Validators.required,
                Validators.min(0)
            ])),
            ebit5: new FormControl(undefined, Validators.compose([
                Validators.required,
                Validators.min(0)
            ])),
            ebit6: new FormControl(undefined, Validators.compose([
                Validators.required,
                Validators.min(0)
            ])),
            discountingRate: new FormControl(undefined, Validators.compose([
                Validators.required,
                Validators.min(0),
                Validators.max(100),
                Validators.pattern(RegExpUtility.from0to100DecimalsRegExp)
            ])),
        });
        this.impactFormStepTwo = new FormGroup({
            physicalAssetsReturn: new FormControl(7.1, Validators.compose([
                // Validators.required,
                Validators.min(0),
                Validators.max(100),
                Validators.pattern(RegExpUtility.from0to100DecimalsRegExp)
            ])),
            financialAssetsReturn: new FormControl(5.0, Validators.compose([
                // Validators.required,
                Validators.min(0),
                Validators.max(100),
                Validators.pattern(RegExpUtility.from0to100DecimalsRegExp)
            ])),
        });
        this.impactFormStepThree = new FormGroup({
            lossOfIntangiblePercentage: new FormControl(18.29, Validators.compose([
                Validators.required,
                Validators.min(0),
                Validators.max(100),
                Validators.pattern(RegExpUtility.from0to100DecimalsRegExp)
            ])),
        });
        this.mySelf = this.dataSharingService.selfAssessment;

        this.impactService.getMyAssets(this.mySelf).toPromise().then((res) => {
            if (res && res.length > 0) {
                this.myAssets = res;
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
                            const fixedIndex = _.findIndex(this.physicalAssetsAkaFixed, {id: asset.id});
                            const currentIndex = _.findIndex(this.financialAssetsAkaCurrent, {id: asset.id});
                            if (fixedIndex !== -1) {
                                this.physicalAssetsAkaFixed.splice(fixedIndex, 1, _.clone(asset));
                            } else if (currentIndex !== -1) {
                                this.financialAssetsAkaCurrent.splice(currentIndex, 1, _.clone(asset));
                            }
                        }

                        this.discountingRate = this.wp3Status.economicCoefficients.discountingRate;
                        this.physicalAssetsReturn = this.wp3Status.economicCoefficients.physicalAssetsReturn;
                        this.financialAssetsReturn = this.wp3Status.economicCoefficients.financialAssetsReturn;
                        this.lossOfIntangiblePercentage = this.wp3Status.economicCoefficients.lossOfIntangible;
                        this.longTermLiabilities = this.wp3Status.economicCoefficients.longTermLiabilities;
                        this.currentLiabilities = this.wp3Status.economicCoefficients.currentLiabilities;

                        this.choosedSectorType = this.wp3Status.sectorType;
                        switch (this.choosedSectorType.toString()) {
                            case SectorType[SectorType.FINANCE_AND_INSURANCE]: {
                                this.sectorChoosed = 'finance_and_insurance';
                                this.sectorString = 'Finance and Insurance';
                                this.isGlobal = false;
                                break;
                            }
                            case SectorType[SectorType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE]: {
                                this.sectorChoosed = 'health_care_and_social_assistance';
                                this.sectorString = 'Health care and social assistance';
                                this.isGlobal = false;
                                break;
                            }
                            case SectorType[SectorType.INFORMATION]: {
                                this.sectorChoosed = 'information';
                                this.sectorString = 'Information';
                                this.isGlobal = false;
                                break;
                            }
                            case SectorType[SectorType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE]: {
                                this.sectorChoosed = 'professional_scientific_and_technical_service';
                                this.sectorString = 'Professional Scientific and Technical Service';
                                this.isGlobal = false;
                                break;
                            }
                            case SectorType[SectorType.GLOBAL]: {
                                this.sectorChoosed = '';
                                this.isGlobal = true;
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
                                case CategoryType.IP.toString(): {
                                    if (impact.sectorType === SectorType.GLOBAL) {
                                        this.impactOnIP = Math.round(impact.loss * 100) / 100;
                                    } else {
                                        this.impactOnSectorialIP = Math.round(impact.loss * 100) / 100;
                                    }
                                    break;
                                }
                                case CategoryType.KEY_COMP.toString(): {
                                    if (impact.sectorType === SectorType.GLOBAL) {
                                        this.impactOnKeyComp = Math.round(impact.loss * 100) / 100;
                                    } else {
                                        this.impactOnSectorialKeyComp = Math.round(impact.loss * 100) / 100;
                                    }
                                    break;
                                }
                                case CategoryType.ORG_CAPITAL.toString(): {
                                    if (impact.sectorType === SectorType.GLOBAL) {
                                        this.impactOnOrgCapital = Math.round(impact.loss * 100) / 100;
                                    } else {
                                        this.impactOnSectorialOrgCapital = Math.round(impact.loss * 100) / 100;
                                    }
                                    break;
                                }
                            }
                        }
                        // TODO mod in splittingValues and value da decommentare
                        for (const splitting of this.wp3Status.splittingValues) {
                            switch (splitting.categoryType.toString()) {
                                case CategoryType.IP.toString(): {
                                    if (splitting.sectorType === SectorType.GLOBAL) {
                                        this.splittingOnIP = Math.round(splitting.value * 100) / 100;
                                    } else {
                                        this.splittingOnSectorialIP = Math.round(splitting.value * 100) / 100;
                                    }
                                    this.evaluateSplittingValue('IP').subscribe((splittingResult: boolean) => {
                                        console.log('SplittingResult: ' + splittingResult);
                                    });
                                    break;
                                }
                                case CategoryType.KEY_COMP.toString(): {
                                    if (splitting.sectorType === SectorType.GLOBAL) {
                                        this.splittingOnKeyComp = Math.round(splitting.value * 100) / 100;
                                    } else {
                                        this.splittingOnSectorialKeyComp = Math.round(splitting.value * 100) / 100;
                                    }
                                    this.evaluateSplittingValue('KEY_COMP').subscribe((splittingResult: boolean) => {
                                        console.log('SplittingResult: ' + splittingResult);
                                    });
                                    break;
                                }
                                case CategoryType.ORG_CAPITAL.toString(): {
                                    if (splitting.sectorType === SectorType.GLOBAL) {
                                        this.splittingOnOrgCapital = Math.round(splitting.value * 100) / 100;
                                    } else {
                                        this.splittingOnSectorialOrgCapital = Math.round(splitting.value * 100) / 100;
                                    }
                                    this.evaluateSplittingValue('ORG_CAPITAL').subscribe((splittingResult: boolean) => {
                                        console.log('SplittingResult: ' + splittingResult);
                                    });
                                    break;
                                }
                            }
                        }
                        this.selectedAssetCategory = '';
                        this.selectedAssetCategoryCode = '';
                        this.selectedAssetSplitting = undefined;
                        this.selectedAssetLosses = undefined;
                    }
                }).catch(() => {
                    this.isGlobal = true;
                    this.wp3Status = null;
                });
            }
        });
    }

    public trackByFn(index: number, value: any) {
        return index;
    }

    public evaluateStepOne() {
        const ebits: EBITMgm[] = [];
        const ebit1: EBITMgm = new EBITMgm();
        ebit1.selfAssessment = this.mySelf;
        ebit1.year = this.firstYear;
        if (String(this.impactFormStepOne.get('ebit1').value).includes(',')) {
            ebit1.value = Math.round(Number((this.impactFormStepOne.get('ebit1').value as string).replace(/,/g, '.')) * 100) / 100;
        } else {
            ebit1.value = Math.round(Number(this.impactFormStepOne.get('ebit1').value as string) * 100) / 100;
        }
        ebits.push(ebit1);
        const ebit2: EBITMgm = new EBITMgm();
        ebit2.selfAssessment = this.mySelf;
        ebit2.year = this.firstYear + 1;
        if (String(this.impactFormStepOne.get('ebit2').value).includes(',')) {
            ebit2.value = Math.round(Number((this.impactFormStepOne.get('ebit2').value as string).replace(/,/g, '.')) * 100) / 100;
        } else {
            ebit2.value = Math.round(Number(this.impactFormStepOne.get('ebit2').value as string) * 100) / 100;
        }
        ebits.push(ebit2);
        const ebit3: EBITMgm = new EBITMgm();
        ebit3.selfAssessment = this.mySelf;
        ebit3.year = this.firstYear + 2;
        if (String(this.impactFormStepOne.get('ebit3').value).includes(',')) {
            ebit3.value = Math.round(Number((this.impactFormStepOne.get('ebit3').value as string).replace(/,/g, '.')) * 100) / 100;
        } else {
            ebit3.value = Math.round(Number(this.impactFormStepOne.get('ebit3').value as string) * 100) / 100;
        }
        ebits.push(ebit3);
        const ebit4: EBITMgm = new EBITMgm();
        ebit4.selfAssessment = this.mySelf;
        ebit4.year = this.firstYear + 3;
        if (String(this.impactFormStepOne.get('ebit4').value).includes(',')) {
            ebit4.value = Math.round(Number((this.impactFormStepOne.get('ebit4').value as string).replace(/,/g, '.')) * 100) / 100;
        } else {
            ebit4.value = Math.round(Number(this.impactFormStepOne.get('ebit4').value as string) * 100) / 100;
        }
        ebits.push(ebit4);
        const ebit5: EBITMgm = new EBITMgm();
        ebit5.selfAssessment = this.mySelf;
        ebit5.year = this.firstYear + 4;
        if (String(this.impactFormStepOne.get('ebit5').value).includes(',')) {
            ebit5.value = Math.round(Number((this.impactFormStepOne.get('ebit5').value as string).replace(/,/g, '.')) * 100) / 100;
        } else {
            ebit5.value = Math.round(Number(this.impactFormStepOne.get('ebit5').value as string) * 100) / 100;
        }
        ebits.push(ebit5);
        const ebit6: EBITMgm = new EBITMgm();
        ebit6.selfAssessment = this.mySelf;
        ebit6.year = this.firstYear + 5;
        if (String(this.impactFormStepOne.get('ebit6').value).includes(',')) {
            ebit6.value = Math.round(Number((this.impactFormStepOne.get('ebit6').value as string).replace(/,/g, '.')) * 100) / 100;
        } else {
            ebit6.value = Math.round(Number(this.impactFormStepOne.get('ebit6').value as string) * 100) / 100;
        }
        ebits.push(ebit6);
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
            this.impactService.evaluateStepOne(inputs, this.mySelf).toPromise().then((res) => {
                if (res) {
                    this.economicPerformance = Math.round(res.economicResults.economicPerformance * 100) / 100;
                }
            });
        }
    }

    public evaluateStepTwo(): Observable<boolean> {
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
        if (this.financialAssetsAkaCurrent &&
            this.physicalAssetsAkaFixed &&
            this.financialAssetsReturn &&
            this.physicalAssetsReturn &&
            this.currentLiabilities &&
            this.longTermLiabilities) {
            const inputs: Wp3BundleInput = new Wp3BundleInput();
            inputs.economicCoefficients = new EconomicCoefficientsMgm();
            inputs.economicCoefficients.physicalAssetsReturn = this.physicalAssetsReturn;
            inputs.economicCoefficients.financialAssetsReturn = this.financialAssetsReturn;
            inputs.economicCoefficients.longTermLiabilities = this.longTermLiabilities;
            inputs.economicCoefficients.currentLiabilities = this.currentLiabilities;
            inputs.myAssets = [];
            inputs.myAssets = this.financialAssetsAkaCurrent.concat(this.physicalAssetsAkaFixed);

            const stepTwo$: Observable<Wp3BundleOutput> = this.impactService.evaluateStepTwo(inputs, this.mySelf);

            const result$: Observable<boolean> = stepTwo$.pipe(
                switchMap((res: Wp3BundleOutput) => {
                    if (res) {
                        this.intangibleDrivingEarnings = Math.round(res.economicResults.intangibleDrivingEarnings * 100) / 100;
                        this.intangibleCapitalValuation = Math.round(res.economicResults.intangibleCapital * 100) / 100;

                        return of(true);
                    } else {
                        return of(false);
                    }
                })
            );

            return result$;
        } else {
            return of(false);
        }
    }

    public evaluateStepThree(): Observable<boolean> {
        if (this.impactFormStepThree.invalid) {
            // gestire l'errore con un messaggio sul campo input
            return;
        }
        if (this.lossOfIntangiblePercentage !== undefined && this.lossOfIntangiblePercentage !== null) {
            if (!this.collapseLosses) {
                this.collapseLosses = true;
            }
            const inputs: Wp3BundleInput = new Wp3BundleInput();
            inputs.economicCoefficients = new EconomicCoefficientsMgm();
            inputs.economicCoefficients.lossOfIntangible = this.lossOfIntangiblePercentage;

            const stepThree$: Observable<Wp3BundleOutput> = this.impactService.evaluateStepThree(inputs, this.mySelf);

            const result$: Observable<boolean> = stepThree$.pipe(
                switchMap((res: Wp3BundleOutput) => {
                    if (res) {
                        this.lossOnintangibleAssetsDueToCyberattacks = Math.round(res.economicResults.intangibleLossByAttacks * 100) / 100;
                        // Next call is present because we chose of collapse step 3 and 4 in same view
                        return this.evaluateStepFour();
                    }
                })
            );

            return result$;
        } else {
            return of(false);
        }
    }

    public evaluateStepThreeUI(): void {
        this.evaluateStepThree().subscribe((res) => {

        });
    }

    public evaluateStepFour(): Observable<boolean> {
        const inputs: Wp3BundleInput = new Wp3BundleInput();
        if (!this.choosedSectorType) {
            inputs.sectorType = SectorType.GLOBAL;
        } else {
            inputs.sectorType = this.choosedSectorType;
        }

        const stepFour$: Observable<Wp3BundleOutput> = this.impactService.evaluateStepFour(inputs, this.mySelf);

        const result$: Observable<boolean> = stepFour$.pipe(
            switchMap((res: Wp3BundleOutput) => {
                if (res) {
                    for (const impactOn of res.splittingLosses) {
                        switch (impactOn.categoryType) {
                            case CategoryType.IP: {
                                if (impactOn.sectorType === SectorType.GLOBAL) {
                                    this.impactOnIP = Math.round(impactOn.loss * 100) / 100;
                                } else {
                                    this.impactOnSectorialIP = Math.round(impactOn.loss * 100) / 100;
                                }
                                break;
                            }
                            case CategoryType.KEY_COMP: {
                                if (impactOn.sectorType === SectorType.GLOBAL) {
                                    this.impactOnKeyComp = Math.round(impactOn.loss * 100) / 100;
                                } else {
                                    this.impactOnSectorialKeyComp = Math.round(impactOn.loss * 100) / 100;
                                }
                                break;
                            }
                            case CategoryType.ORG_CAPITAL: {
                                if (impactOn.sectorType === SectorType.GLOBAL) {
                                    this.impactOnOrgCapital = Math.round(impactOn.loss * 100) / 100;
                                } else {
                                    this.impactOnSectorialOrgCapital = Math.round(impactOn.loss * 100) / 100;
                                }
                                break;
                            }
                        }
                    }

                    return of(true);
                } else {
                    return of(false);
                }
            })
        );

        return result$;
    }

    public evaluateStepFive(): Observable<boolean> {
        const inputs: Wp3BundleInput = new Wp3BundleInput();
        if (!this.choosedSectorType) {
            inputs.sectorType = SectorType.GLOBAL;
        } else {
            inputs.sectorType = this.choosedSectorType;
        }

        const stepFive$: Observable<Wp3BundleOutput> = this.impactService.evaluateStepFive(inputs, this.mySelf);

        const result: Observable<boolean> = stepFive$.pipe(
            switchMap((res: Wp3BundleOutput) => {
                if (res) {
                    for (const splitting of res.splittingValues) {
                        switch (splitting.categoryType) {
                            case CategoryType.IP: {
                                if (splitting.sectorType === SectorType.GLOBAL) {
                                    this.splittingOnIP = Math.round(splitting.value * 100) / 100;
                                } else {
                                    this.splittingOnSectorialIP = Math.round(splitting.value * 100) / 100;
                                }
                                this.evaluateSplittingValue('IP').subscribe((splittingResult: boolean) => {
                                    console.log('SplittingResult: ' + splittingResult);
                                });
                                break;
                            }
                            case CategoryType.KEY_COMP: {
                                if (splitting.sectorType === SectorType.GLOBAL) {
                                    this.splittingOnKeyComp = Math.round(splitting.value * 100) / 100;
                                } else {
                                    this.splittingOnSectorialKeyComp = Math.round(splitting.value * 100) / 100;
                                }
                                this.evaluateSplittingValue('KEY_COMP').subscribe((splittingResult: boolean) => {
                                    console.log('SplittingResult: ' + splittingResult);
                                });
                                break;
                            }
                            case CategoryType.ORG_CAPITAL: {
                                if (splitting.sectorType === SectorType.GLOBAL) {
                                    this.splittingOnOrgCapital = Math.round(splitting.value * 100) / 100;
                                } else {
                                    this.splittingOnSectorialOrgCapital = Math.round(splitting.value * 100) / 100;
                                }
                                this.evaluateSplittingValue('ORG_CAPITAL').subscribe((splittingResult: boolean) => {
                                    console.log('SplittingResult: ' + splittingResult);
                                });
                                break;
                            }
                        }
                    }
                    this.selectedAssetCategory = '';
                    this.selectedAssetCategoryCode = '';
                    this.selectedAssetSplitting = undefined;
                    this.selectedAssetLosses = undefined;
                }

                return of(true);
            })
        );

        return result;
    }

    private evaluateSplittingValue(category: string, evaluatedAsset?: MyAssetMgm): Observable<boolean> {
        this.setAssetCategory(category, false);
        let totalRank = 0;
        let value = 0;
        switch (category) {
            case 'IP': {
                if (this.isGlobal) {
                    value = this.splittingOnIP;
                } else {
                    value = this.splittingOnSectorialIP;
                }
                break;
            }
            case 'KEY_COMP': {
                if (this.isGlobal) {
                    value = this.splittingOnKeyComp;
                } else {
                    value = this.splittingOnSectorialKeyComp;
                }
                break;
            }
            case 'ORG_CAPITAL': {
                if (this.isGlobal) {
                    value = this.splittingOnOrgCapital;
                } else {
                    value = this.splittingOnSectorialOrgCapital;
                }
                break;
            }
        }
        for (const asset of this.assetsBySelectedCategory) {
            if (asset.ranking && asset.ranking > 0) {
                totalRank = totalRank + asset.ranking;
            }
        }
        if (evaluatedAsset) {
            const indexTemp = _.findIndex(this.assetsBySelectedCategory, {id: evaluatedAsset.id});
            if (indexTemp !== -1) {
                this.assetsBySelectedCategory.splice(indexTemp, 1, evaluatedAsset);
            }
        }

        const myAssetsUpdatesArray: Observable<MyAssetMgm>[] = [];

        for (const asset of this.assetsBySelectedCategory) {
            if (asset.ranking && asset.ranking > 0) {
                // (asset_priority / sum_of_asset_priorities) * Category_Value
                asset.economicValue = (asset.ranking / totalRank) * value;
                myAssetsUpdatesArray.push(this.idaUtilService.updateAsset(asset));

                /*.toPromise().then((res) => {
                if (res) {
                    const updatedAsset = res;
                    const indexTemp = _.findIndex(this.assetsBySelectedCategory, {id: updatedAsset.id});
                    const index = _.findIndex(this.myAssets, {id: updatedAsset.id});
                    if (index !== -1) {
                        this.myAssets.splice(index, 1, updatedAsset);
                    }
                    if (indexTemp !== -1) {
                        this.assetsBySelectedCategory.splice(indexTemp, 1, updatedAsset);
                    }
                }*/
            }
        }

        const myAssetsUpdate$: Observable<MyAssetMgm[]> = forkJoin(myAssetsUpdatesArray);

        const result: Observable<boolean> = myAssetsUpdate$.pipe(
            switchMap((updates: MyAssetMgm[]) => {
                if (updates) {
                    updates.forEach((updatedAsset: MyAssetMgm) => {
                        // const updatedAsset = res;
                        const indexTemp = _.findIndex(this.assetsBySelectedCategory, {id: updatedAsset.id});
                        const index = _.findIndex(this.myAssets, {id: updatedAsset.id});
                        if (index !== -1) {
                            this.myAssets.splice(index, 1, updatedAsset);
                        }
                        if (indexTemp !== -1) {
                            this.assetsBySelectedCategory.splice(indexTemp, 1, updatedAsset);
                        }
                    });

                    return of(true);
                } else {
                    return of(false);
                }
            })
        );

        return result;
    }

    // TODO read
    public setAssetCategory(category: string, show: boolean) {
        this.assetsBySelectedCategory = [];
        switch (category) {
            case 'ORG_CAPITAL': {
                for (const asset of this.myAssets) {
                    if (asset.asset.assetcategory.name === 'Organisational capital' ||
                        asset.asset.assetcategory.name === 'Reputation' ||
                        asset.asset.assetcategory.name === 'Brand') {
                        this.assetsBySelectedCategory.push(asset);
                    }
                }
                this.selectedAssetCategory = 'Org Capital';
                this.selectedAssetCategoryCode = 'ORG_CAPITAL';
                if (this.isGlobal) {
                    this.selectedAssetSplitting = this.splittingOnOrgCapital;
                } else {
                    this.selectedAssetSplitting = this.splittingOnSectorialOrgCapital;
                }
                break;
            }
            case 'KEY_COMP': {
                for (const asset of this.myAssets) {
                    if (asset.asset.assetcategory.name === 'Key competences and human capital') {
                        this.assetsBySelectedCategory.push(asset);
                    }
                }
                this.selectedAssetCategory = 'Key Comp';
                this.selectedAssetCategoryCode = 'KEY_COMP';
                if (this.isGlobal) {
                    this.selectedAssetSplitting = this.splittingOnKeyComp;
                } else {
                    this.selectedAssetSplitting = this.splittingOnSectorialKeyComp;
                }
                break;
            }
            case 'IP': {
                for (const asset of this.myAssets) {
                    if (asset.asset.assetcategory.name === 'Intellectual Property (IPR)' ||
                        asset.asset.assetcategory.name === 'Innovation') {
                        this.assetsBySelectedCategory.push(asset);
                    }
                }
                this.selectedAssetCategory = 'IP';
                this.selectedAssetCategoryCode = 'IP';
                if (this.isGlobal) {
                    this.selectedAssetSplitting = this.splittingOnIP;
                } else {
                    this.selectedAssetSplitting = this.splittingOnSectorialIP;
                }
                break;
            }
        }
        if (show) {
            this.collapseSplittings = false;
        }
    }

    public viewLosses(category: string, show: boolean) {
        this.impactService.evaluateMyAssetsEconomicLosses(this.mySelf).toPromise().then(
            (myAssetsEconomicLosses: MyAssetMgm[]) => {
                this.myAssets = myAssetsEconomicLosses;

                this.assetsBySelectedCategory = [];
                switch (category) {
                    case 'ORG_CAPITAL': {
                        for (const asset of this.myAssets) {
                            if (asset.asset.assetcategory.name === 'Organisational capital' ||
                                asset.asset.assetcategory.name === 'Reputation' ||
                                asset.asset.assetcategory.name === 'Brand') {
                                this.assetsBySelectedCategory.push(asset);
                            }
                        }
                        this.selectedAssetCategory = 'Org Capital';
                        this.selectedAssetCategoryCode = 'ORG_CAPITAL';
                        if (this.isGlobal) {
                            this.selectedAssetLosses = this.impactOnOrgCapital;
                        } else {
                            this.selectedAssetLosses = this.impactOnSectorialOrgCapital;
                        }
                        break;
                    }
                    case 'KEY_COMP': {
                        for (const asset of this.myAssets) {
                            if (asset.asset.assetcategory.name === 'Key competences and human capital') {
                                this.assetsBySelectedCategory.push(asset);
                            }
                        }
                        this.selectedAssetCategory = 'Key Comp';
                        this.selectedAssetCategoryCode = 'KEY_COMP';
                        if (this.isGlobal) {
                            this.selectedAssetLosses = this.impactOnKeyComp;
                        } else {
                            this.selectedAssetLosses = this.impactOnSectorialKeyComp;
                        }
                        break;
                    }
                    case 'IP': {
                        for (const asset of this.myAssets) {
                            if (asset.asset.assetcategory.name === 'Intellectual Property (IPR)' ||
                                asset.asset.assetcategory.name === 'Innovation') {
                                this.assetsBySelectedCategory.push(asset);
                            }
                        }
                        this.selectedAssetCategory = 'IP';
                        this.selectedAssetCategoryCode = 'IP';
                        if (this.isGlobal) {
                            this.selectedAssetLosses = this.impactOnIP;
                        } else {
                            this.selectedAssetLosses = this.impactOnSectorialIP;
                        }
                        break;
                    }
                }
                if (show) {
                    this.collapseLosses = false;
                }
            }
        );
    }

    public setSelectedAssetPriority(priority: String, asset: MyAssetMgm) {
        this.collapseLosses = true;
        if (priority) {
            switch (priority) {
                case Priority.LOW.toString().replace('_', ' ').substring(0, 1) +
                Priority.LOW.toString().replace('_', ' ').substring(1).toLowerCase(): {
                    asset.ranking = 1;
                    break;
                }
                case Priority.LOW_MEDIUM.toString().replace('_', ' ').substring(0, 1) +
                Priority.LOW_MEDIUM.toString().replace('_', ' ').substring(1).toLowerCase(): {
                    asset.ranking = 2;
                    break;
                }
                case Priority.MEDIUM.toString().replace('_', ' ').substring(0, 1) +
                Priority.MEDIUM.toString().replace('_', ' ').substring(1).toLowerCase(): {
                    asset.ranking = 3;
                    break;
                }
                case Priority.MEDIUM_HIGH.toString().replace('_', ' ').substring(0, 1) +
                Priority.MEDIUM_HIGH.toString().replace('_', ' ').substring(1).toLowerCase(): {
                    asset.ranking = 4;
                    break;
                }
                case Priority.HIGH.toString().replace('_', ' ').substring(0, 1) +
                Priority.HIGH.toString().replace('_', ' ').substring(1).toLowerCase(): {
                    asset.ranking = 5;
                    break;
                }
                default: {
                    asset.ranking = 0;
                    break;
                }
            }
            this.evaluateSplittingValue(this.selectedAssetCategoryCode, asset).subscribe((splittingResult: boolean) => {
                console.log('SplittingResult: ' + splittingResult);
            });
            // TODO calcolare con la formula di maurizio
            /*
            asset.economicValue = Math.round(Math.random() * 1000000) / 100;
            this.idaUtilService.updateAsset(asset).toPromise().then((res) => {
              if (res) {
                asset = res;
                const indexTemp = _.findIndex(this.assetsBySelectedCategory, { id: asset.id });
                const index = _.findIndex(this.myAssets, { id: asset.id });
                if (index !== -1) {
                  this.myAssets.splice(index, 1, asset);
                }
                if (indexTemp !== -1) {
                  this.assetsBySelectedCategory.splice(indexTemp, 1, asset);
                }
              }
            });
            */
        }
    }

    public isSectorSelected(sector: string):
        boolean {
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

                this.executeStepThree();

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

    private executeStepThree() {
        // 2 4 3 5
        const evaluateStepTwoFourThreeFive$: Observable<boolean> = this.evaluateStepTwo()
            .pipe(
                switchMap((stepTwoResult: boolean) => {
                    if (stepTwoResult) {
                        return this.evaluateStepFour();
                    } else {
                        return of(false);
                    }
                })
            ).pipe(
                switchMap((stepFourResult: boolean) => {
                    if (stepFourResult) {
                        return this.evaluateStepThree();
                    } else {
                        return of(false);
                    }
                })
            ).pipe(
                switchMap((stepThreeResult: boolean) => {
                    if (stepThreeResult) {
                        return this.evaluateStepFive();
                    } else {
                        return of(false);
                    }
                })
            );

        evaluateStepTwoFourThreeFive$.subscribe((twoFourThreeFiveResult: boolean) => {
            console.log('2-4-3-5 result: ' + twoFourThreeFiveResult);
        });
    }

    public onGrowthRateUpdate(updated: boolean) {
        console.error('OnGrowthRateUpdate: ' + updated);

        if (updated) {
            this.executeStepThree();
        }
    }

    public setIsGlobal() {
        this.isGlobal = !this.isGlobal;
        this.collapseSplittings = true;
        this.collapseLosses = true;

        const stepFive$: Observable<boolean> = this.evaluateStepFive();
        const stepFour$: Observable<boolean> = stepFive$.pipe(
            switchMap((stepFive: boolean) => {
                return this.evaluateStepFour();
            })
        );

        if (this.isGlobal || !this.wp3Status || !this.wp3Status.sectorType) {
            this.sectorChoosed = '';
            this.choosedSectorType = SectorType.GLOBAL;
        } else {
            this.choosedSectorType = this.wp3Status.sectorType;
            switch (this.choosedSectorType.toString()) {
                case SectorType[SectorType.FINANCE_AND_INSURANCE]: {
                    this.sectorChoosed = 'finance_and_insurance';
                    this.sectorString = 'Finance and Insurance';
                    break;
                }
                case SectorType[SectorType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE]: {
                    this.sectorChoosed = 'health_care_and_social_assistance';
                    this.sectorString = 'Health care and social assistance';
                    break;
                }
                case SectorType[SectorType.INFORMATION]: {
                    this.sectorChoosed = 'information';
                    this.sectorString = 'Information';
                    break;
                }
                case SectorType[SectorType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE]: {
                    this.sectorChoosed = 'professional_scientific_and_technical_service';
                    this.sectorString = 'Professional Scientific and Technical Service';
                    break;
                }
                case SectorType[SectorType.GLOBAL]: {
                    this.sectorChoosed = '';
                    this.sectorString = '';
                    break;
                }
            }
            this.selectedCategory = this.wp3Status.categoryType;
        }

        stepFour$.subscribe((result: boolean) => {
            console.log('Step 5 -4 result: ' + result);
        });
    }

    /*
    private resetStepFourRes() {
      this.choosedSectorType = null;
      this.impactOnOrgCapital = undefined;
      this.impactOnKeyComp = undefined;
      this.impactOnIP = undefined;
    }
    */

    public setSector(sector: string) {
        this.sectorChoosed = sector;
        switch (sector) {
            case 'finance_and_insurance': {
                this.choosedSectorType = SectorType.FINANCE_AND_INSURANCE;
                this.sectorChoosed = 'finance_and_insurance';
                this.sectorString = 'Finance and Insurance';
                break;
            }
            case 'health_care_and_social_assistance': {
                this.choosedSectorType = SectorType.HEALTH_CARE_AND_SOCIAL_ASSISTANCE;
                this.sectorChoosed = 'health_care_and_social_assistance';
                this.sectorString = 'Health care and social assistance';
                break;
            }
            case 'information': {
                this.choosedSectorType = SectorType.INFORMATION;
                this.sectorChoosed = 'information';
                this.sectorString = 'Information';
                break;
            }
            case 'professional_scientific_and_technical_service': {
                this.choosedSectorType = SectorType.PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE;
                this.sectorChoosed = 'professional_scientific_and_technical_service';
                this.sectorString = 'Professional Scientific and Technical Service';
                break;
            }
        }

        const stepFive$: Observable<boolean> = this.evaluateStepFive();
        const stepFour$: Observable<boolean> = stepFive$.pipe(
            switchMap((stepFive: boolean) => {
                return this.evaluateStepFour();
            })
        );

        stepFour$.subscribe((result: boolean) => {
            console.log('Step 5 -4 result: ' + result);
        });
    }

    public close() {
        this.router.navigate(['/riskboard']);
    }

    clamp(value
              :
              number, min
              :
              number, max
              :
              number
    ):
        number {
        if (isNaN(value)) {
            if (!isNaN(min)) {
                return min;
            } else if (!isNaN(max)) {
                return max;
            } else {
                return undefined;
            }
        } else {
            return _.clamp(value, min, max);
        }
    }

    private resetOrder() {
        this.orderBy.asset = false;
        this.orderBy.priority = false;
        this.orderBy.value = false;
        this.orderBy.valueLoss = false;
        this.orderBy.type = 'desc';
    }

    public tableOrderBy(orderColumn: string, desc: boolean) {
        this.resetOrder();
        if (desc) {
            this.orderBy.type = 'desc';
        } else {
            this.orderBy.type = 'asc';
        }
        switch (orderColumn.toLowerCase()) {
            case ('asset'): {
                this.orderBy.asset = true;
                if (desc) {
                    this.assetsBySelectedCategory = _.orderBy(this.assetsBySelectedCategory, (elem: MyAssetMgm) => elem.asset.name, ['desc']);
                } else {
                    this.assetsBySelectedCategory = _.orderBy(this.assetsBySelectedCategory, (elem: MyAssetMgm) => elem.asset.name, ['asc']);
                }
                break;
            }
            case ('priority'): {
                this.orderBy.priority = true;
                if (desc) {
                    this.assetsBySelectedCategory = _.orderBy(this.assetsBySelectedCategory, (elem: MyAssetMgm) => elem.ranking, ['desc']);
                } else {
                    this.assetsBySelectedCategory = _.orderBy(this.assetsBySelectedCategory, (elem: MyAssetMgm) => elem.ranking, ['asc']);
                }
                break;
            }
            case ('value'): {
                this.orderBy.value = true;
                if (desc) {
                    this.assetsBySelectedCategory = _.orderBy(this.assetsBySelectedCategory, (elem: MyAssetMgm) => elem.economicValue, ['desc']);
                } else {
                    this.assetsBySelectedCategory = _.orderBy(this.assetsBySelectedCategory, (elem: MyAssetMgm) => elem.economicValue, ['asc']);
                }
                break;
            }
            case ('value_loss'): {
                this.orderBy.valueLoss = true;
                if (desc) {
                    this.assetsBySelectedCategory = _.orderBy(this.assetsBySelectedCategory, (elem: MyAssetMgm) => elem.lossValue, ['desc']);
                } else {
                    this.assetsBySelectedCategory = _.orderBy(this.assetsBySelectedCategory, (elem: MyAssetMgm) => elem.lossValue, ['asc']);
                }
                break;
            }
        }
    }

    back() {
        history.back();
    }
}
