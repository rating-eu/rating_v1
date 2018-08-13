import { BaseEntity } from './../../shared';

export class EconomicCoefficientsMgm implements BaseEntity {
    constructor(
        public id?: number,
        public discountingRate?: number,
        public physicalAssetsReturn?: number,
        public financialAssetsReturn?: number,
        public lossOfIntangible?: number,
        public selfAssessment?: BaseEntity,
    ) {
    }
}
