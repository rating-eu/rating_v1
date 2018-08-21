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
