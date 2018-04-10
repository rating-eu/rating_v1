import { BaseEntity, User } from './../../shared';

export class CompanySectorMgm implements BaseEntity {
    constructor(
        public id?: number,
        public department?: string,
        public description?: string,
        public created?: any,
        public modified?: any,
        public user?: User,
        public companyprofile?: BaseEntity,
        public selfassessments?: BaseEntity[],
    ) {
    }
}
