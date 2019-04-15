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

import { EBITMgm } from '../../entities/ebit-mgm';
import { EconomicResultsMgm } from '../../entities/economic-results-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { SectorType, CategoryType } from '../../entities/splitting-loss-mgm';
import { EconomicCoefficientsMgm } from '../../entities/economic-coefficients-mgm';

export class Wp3BundleInput {
    ebits: EBITMgm[];
    economicCoefficients: EconomicCoefficientsMgm;
    myAssets: MyAssetMgm[];
    economicResults: EconomicResultsMgm;
    sectorType: SectorType;
    categoryType: CategoryType;
}
