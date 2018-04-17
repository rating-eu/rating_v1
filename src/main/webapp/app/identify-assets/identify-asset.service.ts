import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../app.constants';
import { JhiDateUtils } from 'ng-jhipster';
import { AssetMgm } from '../entities/asset-mgm/asset-mgm.model';

@Injectable()
export class IdentifyAssetService {

    private resourceUrl =  SERVER_API_URL + 'api/identify-assets';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    findAll(): Observable<AssetMgm[]> {
	   	 return this.http.get<AssetMgm[]>(this.resourceUrl);
       // const options = createRequestOption();
       // return this.http.get<AssetMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
       //     .map((res: HttpResponse<AssetMgm[]>) => this.convertArrayResponse(res));
    }
}
