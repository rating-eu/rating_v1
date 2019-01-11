import {CompType} from '../../entities/company-profile-mgm';

export class RegisterAccount {
    login: string;
    firstName: string;
    lastName: string;
    companyName: string;
    companySector: CompType;
    email: string;
    password: string;
    langKey: string;
}
