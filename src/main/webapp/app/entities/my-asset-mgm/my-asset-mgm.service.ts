import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { MyAssetMgm } from './my-asset-mgm.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<MyAssetMgm>;

@Injectable()
export class MyAssetMgmService {

    private resourceUrl =  SERVER_API_URL + 'api/my-assets';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/my-assets';

    constructor(private http: HttpClient) { }

    create(myAsset: MyAssetMgm): Observable<EntityResponseType> {
        const copy = this.convert(myAsset);
        return this.http.post<MyAssetMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(myAsset: MyAssetMgm): Observable<EntityResponseType> {
        const copy = this.convert(myAsset);
        return this.http.put<MyAssetMgm>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MyAssetMgm>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<MyAssetMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyAssetMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MyAssetMgm[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<MyAssetMgm[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyAssetMgm[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MyAssetMgm[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: MyAssetMgm = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<MyAssetMgm[]>): HttpResponse<MyAssetMgm[]> {
        const jsonResponse: MyAssetMgm[] = res.body;
        const body: MyAssetMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to MyAssetMgm.
     */
    private convertItemFromServer(myAsset: MyAssetMgm): MyAssetMgm {
        const copy: MyAssetMgm = Object.assign({}, myAsset);
        return copy;
    }

    /**
     * Convert a MyAssetMgm to a JSON which can be sent to the server.
     */
    private convert(myAsset: MyAssetMgm): MyAssetMgm {
        const copy: MyAssetMgm = Object.assign({}, myAsset);
        return copy;
    }
}
