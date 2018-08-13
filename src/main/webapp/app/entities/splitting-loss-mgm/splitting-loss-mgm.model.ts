import { BaseEntity } from './../../shared';

export const enum SectorType {
    'GLOBAL',
    'FINANCE_AND_INSURANCE',
    'HEALTH_CARE_AND_SOCIAL_ASSISTANCE',
    'INFORMATION',
    'PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE'
}

export const enum CategoryType {
    'IP',
    'KEY_COMP',
    'ORG_CAPITAL'
}

export class SplittingLossMgm implements BaseEntity {
    constructor(
        public id?: number,
        public sectorType?: SectorType,
        public categoryType?: CategoryType,
        public lossPercentage?: number,
        public loss?: number,
        public selfAssessment?: BaseEntity,
    ) {
    }
}
