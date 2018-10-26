import { EconomicResultsMgm } from '../../entities/economic-results-mgm';
import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { EconomicCoefficientsMgm } from '../../entities/economic-coefficients-mgm';
import { EBITMgm } from '../../entities/ebit-mgm';
import { SectorType, CategoryType, SplittingLossMgm } from '../../entities/splitting-loss-mgm';

export class ImpactEvaluationStatus {
    ebits: EBITMgm[];
    economicCoefficients: EconomicCoefficientsMgm;
    economicResults: EconomicResultsMgm;
    myTangibleAssets: MyAssetMgm[]; // myAssets(current, fixeds)
    sectorType: SectorType;
    categoryType: CategoryType;
    splittingLosses: SplittingLossMgm[]; // Both for GLOBAL & fro SectorType
}
