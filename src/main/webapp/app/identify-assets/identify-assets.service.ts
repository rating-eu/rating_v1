import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../app.constants';

import {JhiDateUtils} from 'ng-jhipster';

import {AssetMgm} from '../entities/asset-mgm/asset-mgm.model';
import {createRequestOption} from '../shared';

export type EntityResponseType = HttpResponse<AssetMgm>;

@Injectable()
export class IdentifyAssetService {

    private resourceUrl = SERVER_API_URL + 'api/identify-assets';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }

    getAssets(): Observable<HttpResponse<AssetMgm[]>> {
        return this.http.get<AssetMgm[]>(`${this.resourceUrl}/`, {observe: 'response'})
            .map((res: HttpResponse<AssetMgm[]>) => this.convertArrayResponse(res));
    }

    findById(id: number): Observable<AssetMgm> {
        return null;
    }

    saveUser(user: AssetMgm): Observable<AssetMgm> {
        return null;
    }

    deleteUserById(id: number): Observable<boolean> {
        return null;
    }

    updateUser(user: AssetMgm): Observable<AssetMgm> {
        return null;
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
