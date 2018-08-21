import { EconomicResultsMgm } from '../../entities/economic-results-mgm';
import { EconomicCoefficientsMgm } from '../../entities/economic-coefficients-mgm';
import { SplittingLossMgm } from '../../entities/splitting-loss-mgm';

export class Wp3BundleOutput {
    economicResults: EconomicResultsMgm;
    economicCoefficients: EconomicCoefficientsMgm;
    splittingLosses: SplittingLossMgm[];
}
