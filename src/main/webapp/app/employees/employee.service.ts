import {Injectable} from '@angular/core';
import {SERVER_API_URL} from "../app.constants";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Employee} from "./models/Employee";
import {CompanyProfileMgm} from "../entities/company-profile-mgm";
import {Role} from "../entities/enumerations/Role.enum";

export type EntityResponseType = HttpResponse<Employee>;

const COMPANY_ID_PLACEHOLDER = '{COMPANY_ID}';

const ROLE_PLACEHOLDER = '{role}';

@Injectable()
export class EmployeeService {

    private resourceUrl = SERVER_API_URL + 'api/employees';
    private resourceUrlByCompanyAndRole = SERVER_API_URL + 'api/employees/company/' + COMPANY_ID_PLACEHOLDER + '/role/' + ROLE_PLACEHOLDER;

    constructor(
        private http: HttpClient
    ) {
    }

    create(employee: Employee): Observable<EntityResponseType> {
        return this.http.post<Employee>(this.resourceUrl, employee, {observe: 'response'});
    }

    findAllByCompanyAndRole(companyProfile: CompanyProfileMgm, role: Role): Observable<HttpResponse<Employee[]>> {
        return this.http.get<Employee[]>(
            this.resourceUrlByCompanyAndRole
                .replace(COMPANY_ID_PLACEHOLDER, String(companyProfile.id))
                .replace(ROLE_PLACEHOLDER, Role[role]),
            {observe: 'response'}
        );
    }
}
