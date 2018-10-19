import { BaseEntity, User } from './../../shared';

export const enum CompType {
    'OTHER',
    'FINANCE_AND_INSURANCE',
    'HEALTH_CARE_AND_SOCIAL_ASSISTANCE',
    'INFORMATION',
    'PROFESSIONAL_SCIENTIFIC_AND_TECHNICAL_SERVICE'
}

export class CompanyProfileMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public created?: any,
        public modified?: any,
        public type?: CompType,
        public companyGroups?: BaseEntity[],
        public user?: User,
        public containers?: BaseEntity[],
    ) {
    }
}
