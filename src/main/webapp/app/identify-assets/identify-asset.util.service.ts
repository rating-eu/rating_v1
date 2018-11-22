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
import { AssetsOneShot } from './model/AssetsOneShot.model';
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

    private resourceUrl = SERVER_API_URL + 'api/my-assets-one-shot/';
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

    // Function to check
    public getSavedIndirectFromDirect(direct: DirectAssetMgm, receivedIndirects: IndirectAssetMgm[]): IndirectAssetMgm[] {
        const indirects: IndirectAssetMgm[] = [];
        for (const ind of receivedIndirects) {
            if (direct.id === ind.directAsset.id) {
                indirects.push(ind);
            }
        }
        return indirects;
    }

    oneShotSave(bundle: AssetsOneShot): Observable<AssetsOneShot> {
        return this.http.post<AssetsOneShot>(this.resourceUrl, bundle, { observe: 'response' })
            .map((res: HttpResponse<AssetsOneShot>) => {
                return res.body;
            });
    }

    public subscribeForIndirectMap(): Observable<any> {
        return this.subscriptorForIndirectMap.asObservable();
    }

    public sendUpdateForIndirectMapToSubscriptor(map: any) {
        this.subscriptorForIndirectMap.next(map);
    }

    public subscribeForMyAssets(): Observable<MyAssetMgm[]> {
        return this.subscriptorForMyAsset.asObservable();
    }

    public sendUpdateForMyAssetsToSubscriptor(asset: MyAssetMgm[]) {
        this.subscriptorForMyAsset.next(asset);
    }

    public subscribeForAnswer(): Observable<MyAnswerMgm[]> {
        return this.subscriptorForAnswersComplited.asObservable();
    }

    public sendUpdateForAnswersToSubscriptor(answers: MyAnswerMgm[]) {
        this.subscriptorForAnswersComplited.next(answers);
    }

    public subscribeForDirect(): Observable<DirectAssetMgm[]> {
        return this.subscriptorForDirectAssets.asObservable();
    }

    public sendUpdateForDirectToSubscriptor(directs: DirectAssetMgm[]) {
        this.subscriptorForDirectAssets.next(directs);
    }

    public subscribeForIndirect(): Observable<IndirectAssetMgm[]> {
        return this.subscriptorForIndirectAssets.asObservable();
    }

    public sendUpdateForIndirectToSubscriptor(indirects: IndirectAssetMgm[]) {
        this.subscriptorForIndirectAssets.next(indirects);
    }

    public getMyDirectAsset(): DirectAssetMgm[] {
        return this.myDirectAssets;
    }

    public getMyIndirectAsset(): IndirectAssetMgm[] {
        return this.myIndirectAssets;
    }

    public getMyAnswersComplited(): MyAnswerMgm[] {
        return this.myAnswersComplited;
    }

    public getMyAssets(): MyAssetMgm[] {
        return this.myAssets;
    }

    public addMyDirectAssets(myAsset: MyAssetMgm) {
        const index = _.findIndex(this.myDirectAssets,
            (myDirectAsset) => (myDirectAsset.myAsset as MyAssetMgm).asset.id === myAsset.asset.id
        );
        if (index === -1) {
            const direct = new DirectAssetMgm();
            direct.myAsset = myAsset;
            direct.id = this.myDirectAssetIndex;
            this.myDirectAssetIndex++;
            direct.costs = undefined;
            direct.effects = undefined;
            this.myDirectAssets.push(direct);
        }
        this.sendUpdateForDirectToSubscriptor(this.myDirectAssets);
    }

    public removeFromMyDirectAssets(asset: MyAssetMgm) {
        const index = _.findIndex(this.myDirectAssets,
            (myDirectAsset) => (myDirectAsset.myAsset as MyAssetMgm).asset.id === asset.asset.id
        );
        if (index !== -1) {
            this.myDirectAssets.splice(index, 1);
        }
        this.sendUpdateForDirectToSubscriptor(this.myDirectAssets);
    }

    public updateMyDirectAssets(asset: MyAssetMgm, cost?: AttackCostMgm, effect?: IndirectAssetMgm) {
        const index = _.findIndex(this.myDirectAssets,
            (myDirectAsset) => (myDirectAsset.myAsset as MyAssetMgm).asset.id === asset.asset.id
        );
        if (index !== -1) {
            if (cost) {
                if (!this.myDirectAssets[index].costs) {
                    this.myDirectAssets[index].costs = [];
                }
                const indexC = _.findIndex(this.myDirectAssets[index].costs as AttackCostMgm[],
                    (dCost) => dCost.type === cost.type
                );
                if (indexC === -1) {
                    this.myDirectAssets[index].costs.push(cost);
                } else {
                    this.myDirectAssets[index].costs.splice(indexC, 1);
                }
            }
            if (effect) {
                /*
                if (!this.myDirectAssets[index].effects) {
                    this.myDirectAssets[index].effects = [];
                }
                let indexF = -1;
                if (this.myDirectAssets[index].effects.length > 0) {
                    indexF = _.findIndex(this.myDirectAssets[index].effects as IndirectAssetMgm[],
                        (dEffect) =>
                            ((dEffect.myAsset as MyAssetMgm).asset as AssetMgm).id ===
                            ((effect.myAsset as MyAssetMgm).asset as AssetMgm).id
                    );
                }
                if (indexF === -1) {
                    this.myDirectAssets[index].effects.push(effect);
                } else {
                    this.myDirectAssets[index].effects.splice(indexF, 1);
                }
                */
            }
        }
    }

    public addMyIndirectAssets(asset: MyAssetMgm, directAsset: DirectAssetMgm) {
        if (asset.asset.id === (directAsset.myAsset.asset as AssetMgm).id) {
            return;
        }
        const index = _.findIndex(this.myIndirectAssets,
            (myIndirectAsset) =>
                (myIndirectAsset.myAsset as MyAssetMgm).asset.id === asset.asset.id &&
                (myIndirectAsset.directAsset as DirectAssetMgm).myAsset.asset.id === (directAsset.myAsset.asset as AssetMgm).id
        );
        if (index === -1) {
            const indirect = new IndirectAssetMgm();
            indirect.myAsset = asset;
            indirect.id = this.myIndirectAssetIndex;
            this.myIndirectAssetIndex++;
            indirect.costs = undefined;
            indirect.directAsset = directAsset;
            this.myIndirectAssets.push(indirect);
        }
        this.sendUpdateForIndirectToSubscriptor(this.myIndirectAssets);
    }

    public removeFromMyIndirectAssets(asset: MyAssetMgm, directAsset?: DirectAssetMgm) {
        if (directAsset) {
            const index = _.findIndex(this.myIndirectAssets,
                (myIndirectAsset) =>
                    (myIndirectAsset.myAsset as MyAssetMgm).asset.id === asset.asset.id &&
                    (myIndirectAsset.directAsset as DirectAssetMgm).myAsset.asset.id === (directAsset.myAsset.asset as AssetMgm).id
            );
            if (index !== -1) {
                this.myIndirectAssets.splice(index, 1);
            }
        } else {
            const indirects = _.filter(this.myIndirectAssets, (indirectAsset) =>
                ((indirectAsset.myAsset as MyAssetMgm).asset as AssetMgm).id === (asset.asset as AssetMgm).id ||
                ((indirectAsset.directAsset as DirectAssetMgm).myAsset.asset as AssetMgm).id === (asset.asset as AssetMgm).id
            );
            for (const i of indirects) {
                const index = _.findIndex(this.myIndirectAssets,
                    (myIndirectAsset) =>
                        ((myIndirectAsset.myAsset as MyAssetMgm).asset as AssetMgm).id === ((i.myAsset as MyAssetMgm).asset as AssetMgm).id
                );
                if (index !== -1) {
                    this.myIndirectAssets.splice(index, 1);
                }
            }
        }
        this.sendUpdateForIndirectToSubscriptor(this.myIndirectAssets);
    }

    public removeFromMyIndirectAssetsByDirect(asset: MyAssetMgm) {
        const indexDirect = _.findIndex(this.myDirectAssets,
            (myDirectAsset) => (myDirectAsset.myAsset as MyAssetMgm).asset.id === asset.asset.id
        );
        if (indexDirect === -1) {
            return;
        }
        const directAsset: DirectAssetMgm = this.myDirectAssets[indexDirect];
        const indirects = _.filter(this.myIndirectAssets, (indirectAsset) =>
            ((indirectAsset.directAsset as DirectAssetMgm).myAsset.asset as AssetMgm).id === (directAsset.myAsset.asset as AssetMgm).id
        );
        for (const i of indirects) {
            const index = _.findIndex(this.myIndirectAssets,
                (myIndirectAsset) =>
                    ((myIndirectAsset.myAsset as MyAssetMgm).asset as AssetMgm).id === ((i.myAsset as MyAssetMgm).asset as AssetMgm).id
            );
            if (index !== -1) {
                this.myIndirectAssets.splice(index, 1);
            }
        }
        this.sendUpdateForIndirectToSubscriptor(this.myIndirectAssets);
    }

    public updateMyIndirectAssets(asset: MyAssetMgm, cost: AttackCostMgm, directAsset: DirectAssetMgm) {
        const index = _.findIndex(this.myIndirectAssets,
            (myIndirectAsset) =>
                (myIndirectAsset.myAsset as MyAssetMgm).asset.id === asset.asset.id &&
                (myIndirectAsset.directAsset as DirectAssetMgm).myAsset.asset.id === (directAsset.myAsset.asset as AssetMgm).id
        );
        if (index !== -1) {
            if (cost) {
                if (!this.myIndirectAssets[index].costs) {
                    this.myIndirectAssets[index].costs = [];
                }
                const indexC = _.findIndex(this.myIndirectAssets[index].costs as AttackCostMgm[],
                    (iCost) => iCost.type === cost.type
                );
                if (indexC === -1) {
                    this.myIndirectAssets[index].costs.push(cost);
                } else {
                    this.myIndirectAssets[index].costs.splice(indexC, 1);
                }
            }
            if (directAsset) {
                this.myIndirectAssets[index].directAsset = directAsset;
            }
            // this.sendUpdateForIndirectToSubscriptor(this.myIndirectAssets);
        }
    }

    public removeFromMyAnswerByAsset(asset: MyAssetMgm) {
        const answerToRemove = _.filter(this.myAnswerLinkedMap, (linked) =>
            linked[3] === asset.asset.id
        );
        const answerToPreserve = _.filter(this.myAnswerLinkedMap, (linked) =>
            linked[3] !== asset.asset.id
        );
        for (const rem of answerToRemove) {
            const indexQ = _.findIndex(this.myAnswersComplited, (myAnswer) =>
                myAnswer.answer.id === rem[0] &&
                myAnswer.question.id === rem[1] &&
                myAnswer.answerOffset === rem[2]
            );
            if (indexQ !== -1) {
                this.myAnswersComplited.splice(indexQ, 1);
            }
        }
        for (const pre of answerToPreserve) {
            let offsetsAnsw = _.filter(this.myAnswersComplited, (myAnswer) =>
                myAnswer.answer.id === pre[0] &&
                myAnswer.question.id === pre[1] &&
                myAnswer.answerOffset >= 0
            );
            if (offsetsAnsw.length !== 0) {
                offsetsAnsw = _.orderBy(offsetsAnsw, ['answerOffset'], ['asc']);
                let index = 0;
                for (const oA of offsetsAnsw) {
                    if (oA.answerOffset === 0) {
                        index++;
                        continue;
                    } else {
                        if (oA.answerOffset === index) {
                            index++;
                            continue;
                        }
                        const indexSubs = _.findIndex(this.myAnswersComplited, (myAnswer) =>
                            myAnswer.answer.id === oA.answer.id &&
                            myAnswer.question.id === oA.question.id &&
                            myAnswer.answerOffset === oA.answerOffset
                        );
                        for (let i = 0; i < this.myAnswerLinkedMap.length; i++) {
                            if (this.myAnswerLinkedMap[i][0] === oA.answer.id &&
                                this.myAnswerLinkedMap[i][1] === oA.question.id &&
                                this.myAnswerLinkedMap[i][2] === oA.answerOffset) {
                                this.myAnswerLinkedMap[i][2] = index;
                            }
                        }
                        oA.answerOffset = index;
                        index++;
                        this.myAnswersComplited.splice(indexSubs, 1, oA);
                    }
                }
            }
        }
        this.myAnswerLinkedMap = _.filter(this.myAnswerLinkedMap, (linked) =>
            linked[3] !== asset.asset.id
        );
    }

    public getMyLinkedMap(): any {
        return this.myAnswerLinkedMap;
    }

    public addMyAnswer(answer: MyAnswerMgm) {
        const index = _.findIndex(this.myAnswersComplited,
            (myAnswer) =>
                myAnswer.answer.id === answer.answer.id &&
                myAnswer.question.id === answer.question.id &&
                myAnswer.answerOffset === answer.answerOffset
        );
        if (index === -1) {
            let linked: any;
            if (answer.answer.asset) {
                linked = [answer.answer.id, answer.question.id, answer.answerOffset, answer.answer.asset.id];
                this.myAnswerLinkedMap.push(linked);
            } else if (answer.answer.assetCategory) {
                // ricerco su myAssets
                for (const gA of this.myAssets) {
                    if ((gA.asset as AssetMgm).assetcategory.id === answer.answer.assetCategory.id) {
                        linked = [answer.answer.id, answer.question.id, answer.answerOffset, gA.asset.id];
                        this.myAnswerLinkedMap.push(linked);
                    }
                }
                /*
                // ricerco su direct
                for (const dA of this.myDirectAssets) {
                    if ((((dA.myAsset) as MyAssetMgm).asset as AssetMgm).assetcategory.id === answer.answer.assetCategory.id) {
                        linked = [answer.answer.id, answer.question.id, answer.answerOffset, (((dA.myAsset) as MyAssetMgm).asset as AssetMgm).id];
                        this.myAnswerLinkedMap.push(linked);
                    }
                }
                // ricerco su indirect
                for (const dI of this.myIndirectAssets) {
                    if ((((dI.myAsset) as MyAssetMgm).asset as AssetMgm).assetcategory.id === answer.answer.assetCategory.id) {
                        linked = [answer.answer.id, answer.question.id, answer.answerOffset, (((dI.myAsset) as MyAssetMgm).asset as AssetMgm).id];
                        this.myAnswerLinkedMap.push(linked);
                    }
                }
                */
            } else {
                linked = [answer.answer.id, answer.question.id, answer.answerOffset];
                this.myAnswerLinkedMap.push(linked);
            }
            this.myAnswersComplited.push(answer);
        }
    }

    public removeFromMyAnswer(answer: MyAnswerMgm) {
        const index = _.findIndex(this.myAnswersComplited,
            (myAnswer) => myAnswer.answer.id === answer.answer.id && myAnswer.question.id === answer.question.id && myAnswer.answerOffset === answer.answerOffset
        );
        // Prevedere pulizia delle linkedAnswer
        if (index !== -1) {
            this.myAnswersComplited.splice(index, 1);
            if (answer.answer.asset) {
                const indexQ = _.findIndex(this.myAnswerLinkedMap, (linked) =>
                    linked[0] === answer.answer.id &&
                    linked[1] === answer.question.id &&
                    linked[2] === answer.answerOffset &&
                    linked[3] === answer.answer.asset.id
                );
                if (indexQ !== -1) {
                    this.myAnswerLinkedMap.splice(indexQ, 1);
                }
            } else if (answer.answer.assetCategory) {
                // ricerco su myAssets
                for (const gA of this.myAssets) {
                    if ((gA.asset as AssetMgm).assetcategory.id === answer.answer.assetCategory.id) {
                        const indexQ = _.findIndex(this.myAnswerLinkedMap, (linked) =>
                            linked[0] === answer.answer.id &&
                            linked[1] === answer.question.id &&
                            linked[2] === answer.answerOffset &&
                            linked[3] === gA.asset.id
                        );
                        if (indexQ !== -1) {
                            this.myAnswerLinkedMap.splice(indexQ, 1);
                        }
                    }
                }
                /*
                // ricerco su direct
                for (const dA of this.myDirectAssets) {
                    if ((((dA.myAsset) as MyAssetMgm).asset as AssetMgm).assetcategory.id === answer.answer.assetCategory.id) {
                        const indexQ = _.findIndex(this.myAnswerLinkedMap, (linked) =>
                            linked[0] === answer.answer.id &&
                            linked[1] === answer.question.id &&
                            linked[2] === answer.answerOffset &&
                            linked[3] === (((dA.myAsset) as MyAssetMgm).asset as AssetMgm).id
                        );
                        if (indexQ !== -1) {
                            this.myAnswerLinkedMap.splice(indexQ, 1);
                        }
                    }
                }
                // ricerco su indirect
                for (const dI of this.myIndirectAssets) {
                    if ((((dI.myAsset) as MyAssetMgm).asset as AssetMgm).assetcategory.id === answer.answer.assetCategory.id) {
                        const indexQ = _.findIndex(this.myAnswerLinkedMap, (linked) =>
                            linked[0] === answer.answer.id &&
                            linked[1] === answer.question.id &&
                            linked[2] === answer.answerOffset &&
                            linked[3] === (((dI.myAsset) as MyAssetMgm).asset as AssetMgm).id
                        );
                        if (indexQ !== -1) {
                            this.myAnswerLinkedMap.splice(indexQ, 1);
                        }
                    }
                }
                */
            } else {
                const indexQ = _.findIndex(this.myAnswerLinkedMap, (linked) =>
                    linked[0] === answer.answer.id &&
                    linked[1] === answer.question.id &&
                    linked[2] === answer.answerOffset
                );
                if (indexQ !== -1) {
                    this.myAnswerLinkedMap.splice(indexQ, 1);
                }
            }
        }
    }

    public updateMyAnswers(answer: MyAnswerMgm) {
        const index = _.findIndex(this.myAnswersComplited,
            (myAnswer) => myAnswer.answer.id === answer.answer.id && myAnswer.question.id === answer.question.id && myAnswer.answerOffset === answer.answerOffset
        );
        this.myAnswersComplited.splice(index, 1, answer);
    }

    public addMyAsset(asset: MyAssetMgm) {
        const index = _.findIndex(this.myAssets,
            (myAsset) => myAsset.asset.id === asset.asset.id
        );
        if (index === -1) {
            asset.id = this.myAssetIndex;
            this.myAssetIndex++;
            this.myAssets.push(asset);
            const directIndexCategory = _.findIndex(this.myDirectAssets,
                (myDirectAsset) =>
                    ((myDirectAsset.myAsset as MyAssetMgm).asset as AssetMgm).assetcategory.id === (asset.asset as AssetMgm).assetcategory.id
            );
            if (directIndexCategory !== -1) {
                this.addMyDirectAssets(asset);
            }
        }
    }

    public updateMyAssets(asset: MyAssetMgm, property: string) {
        const index = _.findIndex(this.myAssets,
            (myAsset) => myAsset.asset.id === asset.asset.id
        );
        if (index === -1) {
            return;
        }
        switch (property) {
            case 'asset': {
                this.myAssets[index].asset = asset.asset;
                break;
            }
            case 'estimated': {
                this.myAssets[index].estimated = asset.estimated;
                break;
            }
            case 'id': {
                this.myAssets[index].id = asset.id;
                break;
            }
            case 'magnitude': {
                this.myAssets[index].magnitude = asset.magnitude;
                break;
            }
            case 'questionnaire': {
                this.myAssets[index].questionnaire = asset.questionnaire;
                break;
            }
            case 'ranking': {
                this.myAssets[index].ranking = asset.ranking;
                break;
            }
            case 'selfAssessment': {
                this.myAssets[index].selfAssessment = asset.selfAssessment;
                break;
            }
        }
        /*
        if (index !== -1) {
            asset.asset ? this.myAssets[index].asset = asset.asset : this.myAssets[index].asset = undefined;
            asset.estimated ? this.myAssets[index].estimated = asset.estimated : this.myAssets[index].estimated = undefined;
            asset.id ? this.myAssets[index].id = asset.id : this.myAssets[index].id = undefined;
            asset.magnitude ? this.myAssets[index].magnitude = asset.magnitude : this.myAssets[index].magnitude = undefined;
            asset.questionnaire ? this.myAssets[index].questionnaire = asset.questionnaire : this.myAssets[index].questionnaire = undefined;
            asset.ranking ? this.myAssets[index].ranking = asset.ranking : this.myAssets[index].ranking = undefined;
            asset.selfAssessment ? this.myAssets[index].selfAssessment = asset.selfAssessment : this.myAssets[index].selfAssessment = undefined;
        } else {
            this.myAssets.push(asset);
        }
        */
    }

    public removeFromMyAssets(asset: MyAssetMgm) {
        const index = _.findIndex(this.myAssets,
            (myAsset) => myAsset.asset.id === asset.asset.id
        );
        if (index !== -1) {
            this.myAssets.splice(index, 1);
        }
        /*
        if (this.myAssets[index].estimated === undefined &&
            this.myAssets[index].magnitude === undefined &&
            this.myAssets[index].ranking === undefined
        ) {
            this.myAssets.splice(index, 1);
        }
        */
    }

}
