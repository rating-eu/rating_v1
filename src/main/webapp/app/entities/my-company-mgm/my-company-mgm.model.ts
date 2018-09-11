import { BaseEntity, User } from './../../shared';

export class MyCompanyMgm implements BaseEntity {
    constructor(
        public id?: number,
        public user?: User,
        public companyProfile?: BaseEntity,
    ) {
    }
}
