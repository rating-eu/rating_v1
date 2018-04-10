import { BaseEntity, User } from './../../shared';

export const enum CompType {
    'INFORMATION',
    'HEALTHCARE',
    'FINANCE',
    'ACCOMODATION',
    'ADMINISTRATIVE',
    'AGRICOLTURE',
    'CONSTRUCTION',
    'EDUCATION',
    'ENTERTAINMENT',
    'MANAGEMENT',
    'MANUFACTURING',
    'MINING',
    'OTHERSERVICES',
    'PROFESSIONAL',
    'PUBLIC',
    'REALESTATE',
    'RETAILS',
    'TRADE',
    'TRANSPORTATION',
    'UTILITIES'
}

export class CompanyProfileMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public created?: any,
        public modified?: any,
        public type?: CompType,
        public departments?: BaseEntity[],
        public user?: User,
        public containers?: BaseEntity[],
        public selfassessments?: BaseEntity[],
    ) {
    }
}
