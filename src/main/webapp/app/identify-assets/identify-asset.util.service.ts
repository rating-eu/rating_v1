import { MyAssetMgm } from './../entities/my-asset-mgm/my-asset-mgm.model';
import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MyAnswerMgm } from '../entities/my-answer-mgm';
import { DirectAssetMgm } from '../entities/direct-asset-mgm';
import { IndirectAssetMgm } from '../entities/indirect-asset-mgm';
import { Subject } from 'rxjs';
import { AssetMgm } from '../entities/asset-mgm';
import { AttackCostMgm } from '../entities/attack-cost-mgm';
import { SERVER_API_URL } from '../app.constants';
import { SelfAssessmentMgm } from '../entities/self-assessment-mgm';

@Injectable()
export class IdentifyAssetUtilService {
    private myAnswersComplited: MyAnswerMgm[];
    private myAssets: MyAssetMgm[];
    private myDirectAssets: DirectAssetMgm[];
    private myIndirectAssets: IndirectAssetMgm[];
    private myAnswerLinkedMap: any[];

    private myAssetIndex = 1;
    private myDirectAssetIndex = 1;
    private myIndirectAssetIndex = 1;

    private subscriptorForMyAsset: Subject<MyAssetMgm[]> = new Subject<MyAssetMgm[]>();
    private subscriptorForDirectAssets: Subject<DirectAssetMgm[]> = new Subject<DirectAssetMgm[]>();
    private subscriptorForIndirectAssets: Subject<IndirectAssetMgm[]> = new Subject<IndirectAssetMgm[]>();
    private subscriptorForAnswersComplited: Subject<MyAnswerMgm[]> = new Subject<MyAnswerMgm[]>();
    private subscriptorForIndirectMap: Subject<any> = new Subject<any>();

    private assetServiceUrl = SERVER_API_URL + 'api/my-assets/self-assessment/';
    private directUrl = SERVER_API_URL + 'api/{selfAssessmentID}/direct-assets';
    private indirectUrl = SERVER_API_URL + 'api/{selfAssessmentID}/indirect-assets';
    private allAsset = SERVER_API_URL + 'api/assets';
    private updateAssetUri = SERVER_API_URL + 'api/my-assets';
    private updateDirectAssetUri = SERVER_API_URL + '/api/direct-assets';
    private updateIndirectAssetUri = SERVER_API_URL + 'api/indirect-assets';
    private createMyAssets = SERVER_API_URL + 'api/{selfAssessmentID}/my-assets/all';
    private allAttackCost = SERVER_API_URL + 'api/attack-costs';

    constructor(
        private http: HttpClient
    ) {
        if (!this.myAnswersComplited) {
            this.myAnswersComplited = [];
        }
        if (!this.myAssets) {
            this.myAssets = [];
        }
        if (!this.myDirectAssets) {
            this.myDirectAssets = [];
        }
        if (!this.myIndirectAssets) {
            this.myIndirectAssets = [];
        }
        if (!this.myAnswerLinkedMap) {
            this.myAnswerLinkedMap = [];
        }
    }

    public getMySavedAssets(self: SelfAssessmentMgm): Observable<MyAssetMgm[]> {
        const uri = this.assetServiceUrl + self.id.toString();
        return this.http.get<MyAssetMgm[]>(uri, { observe: 'response' })
            .map((res: HttpResponse<MyAssetMgm[]>) => {
                return res.body;
            });
    }

    public getAllAssets(): Observable<AssetMgm[]> {
        return this.http.get<AssetMgm[]>(this.allAsset, { observe: 'response' })
            .map((res: HttpResponse<AssetMgm[]>) => {
                return res.body;
            });
    }

    public updateAsset(myAsset: MyAssetMgm): Observable<MyAssetMgm> {
        return this.http.put<MyAssetMgm>(this.updateAssetUri, myAsset, { observe: 'response' })
            .map((res: HttpResponse<MyAssetMgm>) => {
                return res.body;
            });
    }

    public updateDirectAsset(myDirect: DirectAssetMgm): Observable<DirectAssetMgm> {
        return this.http.put<DirectAssetMgm>(this.updateDirectAssetUri, myDirect, { observe: 'response' })
            .map((res: HttpResponse<DirectAssetMgm>) => {
                return res.body;
            });
    }

    public getMySavedDirectAssets(self: SelfAssessmentMgm): Observable<DirectAssetMgm[]> {
        const uri = this.directUrl.replace('{selfAssessmentID}', String(self.id));
        return this.http.get<DirectAssetMgm[]>(uri, { observe: 'response' })
            .map((res: HttpResponse<DirectAssetMgm[]>) => {
                return res.body;
            });
    }

    public getMySavedIndirectAssets(self: SelfAssessmentMgm): Observable<IndirectAssetMgm[]> {
        const uri = this.indirectUrl.replace('{selfAssessmentID}', String(self.id));
        return this.http.get<IndirectAssetMgm[]>(uri, { observe: 'response' })
            .map((res: HttpResponse<IndirectAssetMgm[]>) => {
                return res.body;
            });
    }

    public createUpdateMyAssets(self: SelfAssessmentMgm, myAssets: MyAssetMgm[]): Observable<MyAssetMgm[]> {
        const uri = this.createMyAssets.replace('{selfAssessmentID}', String(self.id));
        const copy: MyAssetMgm[] = this.convertArray(myAssets);
        return this.http.post<MyAssetMgm[]>(uri, copy, { observe: 'response' })
            .map((res: HttpResponse<MyAssetMgm[]>) => this.convertArrayResponse(res).body);
    }

    public getAllSystemAttackCosts(): Observable<AttackCostMgm[]> {
        return this.http.get<AttackCostMgm[]>(this.allAttackCost, { observe: 'response' })
            .map((res: HttpResponse<AttackCostMgm[]>) => {
                return res.body;
            });
    }

    private convertArrayResponse(res: HttpResponse<MyAssetMgm[]>): HttpResponse<MyAssetMgm[]> {
        const jsonResponse: MyAssetMgm[] = res.body;
        const body: MyAssetMgm[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({ body });
    }

    private convertItemFromServer(myAsset: MyAssetMgm): MyAssetMgm {
        const copy: MyAssetMgm = Object.assign({}, myAsset);
        return copy;
    }

    private convertArray(myAssets: MyAssetMgm[]): MyAssetMgm[] {
        const copy: MyAssetMgm[] = Object.assign([], myAssets);
        return copy;
    }
}
