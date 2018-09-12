import { BaseEntity, User } from './../../shared';
import {CompanyProfileMgm} from '../company-profile-mgm';

export class MyCompanyMgm implements BaseEntity {
    constructor(
        public id?: number,
        public user?: User,
        public companyProfile?: CompanyProfileMgm,
    ) {
    }
}
