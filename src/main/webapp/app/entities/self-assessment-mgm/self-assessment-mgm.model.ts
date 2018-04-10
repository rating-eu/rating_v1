import { BaseEntity, User } from './../../shared';

export class SelfAssessmentMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public modified?: any,
        public user?: User,
        public companyprofiles?: BaseEntity[],
        public companysectors?: BaseEntity[],
        public assets?: BaseEntity[],
        public threatagents?: BaseEntity[],
        public attackstrategies?: BaseEntity[],
        public externalaudits?: BaseEntity[],
        public questionnaires?: BaseEntity[],
    ) {
    }
}
