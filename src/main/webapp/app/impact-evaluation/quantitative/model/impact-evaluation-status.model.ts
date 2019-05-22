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

import { SplittingValueMgm } from '../../../entities/splitting-value-mgm/splitting-value-mgm.model';
import { EconomicResultsMgm } from '../../../entities/economic-results-mgm';
import { MyAssetMgm } from '../../../entities/my-asset-mgm';
import { EconomicCoefficientsMgm } from '../../../entities/economic-coefficients-mgm';
import { EBITMgm } from '../../../entities/ebit-mgm';
import { SectorType, CategoryType, SplittingLossMgm } from '../../../entities/splitting-loss-mgm';

export class ImpactEvaluationStatus {
    ebits: EBITMgm[];
    economicCoefficients: EconomicCoefficientsMgm;
    economicResults: EconomicResultsMgm;
    myTangibleAssets: MyAssetMgm[]; // myAssets(current, fixeds)
    sectorType: SectorType;
    categoryType: CategoryType;
    splittingLosses: SplittingLossMgm[]; // Both for GLOBAL & fro SectorType
    splittingValues: SplittingValueMgm[]; // Both for GLOBAL & fro SectorType
}
