import {Injectable} from '@angular/core';
import {SERVER_API_URL} from "../../app.constants";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {DataOperationMgm, EntityResponseType} from "../../entities/data-operation-mgm";

const COMPANY_ID = "{companyProfileID}";

@Injectable()
export class DataOperationsService {

    private resourceUrl = SERVER_API_URL + 'api/data-operations';
    private resourceByCompanyProfileUrl = SERVER_API_URL + "api/data-operations/company-profile/" + COMPANY_ID;

    constructor(private http: HttpClient) {
    }

    getOperationsByCompanyProfile(companyProfileID: number): Observable<HttpResponse<DataOperationMgm[]>> {
        const options = new HttpParams();

        return this.http.get<DataOperationMgm[]>(this.resourceByCompanyProfileUrl
            .replace(COMPANY_ID, String(companyProfileID)), {params: options, observe: 'response'})
            .map((res: HttpResponse<DataOperationMgm[]>) => this.convertArrayResponse(res));
    }

    // Converters
    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DataOperationMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DataOperationMgm[]>): HttpResponse<DataOperationMgm[]> {
        const jsonResponse: DataOperationMgm[] = res.body;
        const body: DataOperationMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DataOperationMgm.
     */
    private convertItemFromServer(dataOperation: DataOperationMgm): DataOperationMgm {
        const copy: DataOperationMgm = Object.assign({}, dataOperation);
        return copy;
    }

    /**
     * Convert a DataOperationMgm to a JSON which can be sent to the server.
     */
    private convert(dataOperation: DataOperationMgm): DataOperationMgm {
        const copy: DataOperationMgm = Object.assign({}, dataOperation);
        return copy;
    }
}
