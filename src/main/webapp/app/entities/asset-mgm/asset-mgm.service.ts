import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { AssetMgm } from './asset-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<AssetMgm>;

@Injectable()
export class AssetMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/assets';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/assets';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(asset: AssetMgm): Observable<EntityResponseType> {
        const copy = this.convert(asset);
        return this.http.post<AssetMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(asset: AssetMgm): Observable<EntityResponseType> {
        const copy = this.convert(asset);
        return this.http.put<AssetMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<AssetMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<AssetMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AssetMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<AssetMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<AssetMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<AssetMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<AssetMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: AssetMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<AssetMgm[]>): HttpResponse<AssetMgm[]> {
        const jsonResponse: AssetMgm[] = res.body;
        const body: AssetMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to AssetMgm.
     */
    private convertItemFromServer(asset: AssetMgm): AssetMgm {
        const copy: AssetMgm = Object.assign({}, asset);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(asset.created);
        copy.modified = this.dateUtils
            .convertDateTimeFromServer(asset.modified);
        return copy;
    }

    /**
     * Convert a AssetMgm to a JSON which can be sent to the server.
     */
    private convert(asset: AssetMgm): AssetMgm {
        const copy: AssetMgm = Object.assign({}, asset);

        copy.created = this.dateUtils.toDate(asset.created);

        copy.modified = this.dateUtils.toDate(asset.modified);
        return copy;
    }
}
