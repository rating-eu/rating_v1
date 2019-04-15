/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { Subject } from 'rxjs/Subject';
import { GrowthRate } from './model/growth-rates.model';
import { AttackCostMgm, CostType } from './../entities/attack-cost-mgm/attack-cost-mgm.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '../../../../../node_modules/@angular/common/http';
import { SelfAssessmentMgm } from '../entities/self-assessment-mgm';
import { SERVER_API_URL } from '../app.constants';
import { Observable } from '../../../../../node_modules/rxjs';
import { MyAssetMgm } from '../entities/my-asset-mgm';
import { Wp3BundleInput } from './model/wp3-bundle-input.model';
import { Wp3BundleOutput } from './model/wp3-bundle-output.model';
import { ImpactEvaluationStatus } from './model/impact-evaluation-status.model';
import { AttackCostParamMgm } from '../entities/attack-cost-param-mgm';
import { ImpactLevelMgm } from '../entities/impact-level-mgm';

@Injectable()
export class ImpactEvaluationService {
    private assetServiceUrl = SERVER_API_URL + 'api/my-assets/self-assessment/';
    private wp3ServiceUrl = SERVER_API_URL + 'api/{selfAssessmentID}';
    private wp3StatusUrl = SERVER_API_URL + 'api/{selfAssessmentID}/dashboard/impact-evaluation-status';
    private attackCostUrl = SERVER_API_URL + 'api/{selfAssessmentID}/attack-costs';
    private attackCostParamsUrl = SERVER_API_URL + 'api/{selfAssessmentID}/attack-cost-params';
    private updateAttackCostParamsUrl = SERVER_API_URL + 'api/attack-cost-params';
    private evaluateAttackCostUrl = SERVER_API_URL + 'api/{selfAssessmentID}/{costType}/evaluate-attack-cost';
    private updateAttackCostUrl = SERVER_API_URL + 'api/{selfAssessmentID}/attack-costs';
    private getImpactsBySelfAssessment = SERVER_API_URL + 'api/{selfAssessmentID}/economic-impact';
    private getImpactOfAssetBySelfAssessment = SERVER_API_URL + 'api/{selfAssessmentID}/economic-impact/{myAssetID}';
    private operationStepOne = '/wp3/step-one/';
    private operationStepTwo = '/wp3/step-two/';
    private operationStepThree = '/wp3/step-three/';
    private operationStepFour = '/wp3/step-four/';
    private operationStepFive = '/wp3/step-five/';
    private myAssetsEconomicLossesEvaluationStep = '/wp3/economic-losses';
    private getGrowthRatesURL = SERVER_API_URL + 'api/{selfAssessmentID}/growth-rates';
    private updateAllGrowthRates = SERVER_API_URL + 'api/{selfAssessmentID}/growth-rates';
    private updateSingleGrowthRate = SERVER_API_URL + 'api/growth-rates';
    private updateAllCriticalLevel = SERVER_API_URL + 'api/impact-levels/all';
    private subscriptorForCriticalLevel: Subject<ImpactLevelMgm[]> = new Subject<ImpactLevelMgm[]>();

    constructor(
        private http: HttpClient
    ) {
    }

    public subscribeForImpactLevel(): Observable<ImpactLevelMgm[]> {
        return this.subscriptorForCriticalLevel.asObservable();
    }

    public sendUpdateForImpactLevelToSubscriptor(level: ImpactLevelMgm[]) {
        this.subscriptorForCriticalLevel.next(level);
    }

    getGrowthRates(self: SelfAssessmentMgm) {
        const uri = this.getGrowthRatesURL.replace('{selfAssessmentID}', String(self.id));
        return this.http.get<GrowthRate[]>(uri, { observe: 'response' })
            .map((res: HttpResponse<GrowthRate[]>) => {
                return res.body;
            });
    }

    updateGrowthRates(self: SelfAssessmentMgm, rates: GrowthRate[]): Observable<GrowthRate[]> {
        const uri = this.updateAllGrowthRates.replace('{selfAssessmentID}', String(self.id));
        return this.http.put<GrowthRate[]>(uri, rates, { observe: 'response' })
            .map((res: HttpResponse<GrowthRate[]>) => {
                return res.body;
            });
    }

    updateGrowthRate(rate: GrowthRate): Observable<GrowthRate> {
        return this.http.put<GrowthRate>(this.updateSingleGrowthRate, rate, { observe: 'response' })
            .map((res: HttpResponse<GrowthRate>) => {
                return res.body;
            });
    }

    updateAll(impactLevels: ImpactLevelMgm[]): Observable<ImpactLevelMgm[]> {
        return this.http.put<ImpactLevelMgm[]>(this.updateAllCriticalLevel, impactLevels, { observe: 'response' })
            .map((res: HttpResponse<ImpactLevelMgm[]>) => {
                return res.body;
            });
    }

    getImpacts(self: SelfAssessmentMgm): Observable<MyAssetMgm[]> {
        const uri = this.getImpactsBySelfAssessment.replace('{selfAssessmentID}', String(self.id));
        return this.http.get<MyAssetMgm[]>(uri, { observe: 'response' })
            .map((res: HttpResponse<MyAssetMgm[]>) => {
                return res.body;
            });
    }

    getImpact(self: SelfAssessmentMgm, myAsset: MyAssetMgm): Observable<MyAssetMgm> {
        let uri = this.getImpactOfAssetBySelfAssessment.replace('{selfAssessmentID}', String(self.id));
        uri = uri.replace('{myAssetID}', String(myAsset.id));
        return this.http.get<MyAssetMgm>(uri, { observe: 'response' })
            .map((res: HttpResponse<MyAssetMgm>) => {
                return res.body;
            });
    }

    updateAttackCost(self: SelfAssessmentMgm, cost: AttackCostMgm): Observable<AttackCostMgm> {
        const uri = this.updateAttackCostUrl.replace('{selfAssessmentID}', String(self.id));
        return this.http.put<AttackCostMgm>(uri, cost, { observe: 'response' })
            .map((res: HttpResponse<AttackCostMgm>) => {
                return res.body;
            });
    }

    updateCreateAttackCostParam(param: AttackCostParamMgm): Observable<AttackCostParamMgm> {
        return this.http.put<AttackCostParamMgm>(this.updateAttackCostParamsUrl, param, { observe: 'response' })
            .map((res: HttpResponse<AttackCostParamMgm>) => {
                return res.body;
            });
    }

    evaluateAttackCost(self: SelfAssessmentMgm, attackCostType: CostType, params: AttackCostParamMgm[]): Observable<AttackCostMgm> {
        let uri = this.evaluateAttackCostUrl.replace('{selfAssessmentID}', String(self.id));
        uri = uri.replace('{costType}', CostType[attackCostType]);
        return this.http.post<AttackCostMgm>(uri, params, { observe: 'response' })
            .map((res: HttpResponse<AttackCostMgm>) => {
                return res.body;
            });
    }

    getAttackCost(self: SelfAssessmentMgm): Observable<AttackCostMgm[]> {
        return this.http.get<AttackCostMgm[]>(
            this.attackCostUrl.replace('{selfAssessmentID}', String(self.id)),
            { observe: 'response' })
            .map((res: HttpResponse<AttackCostMgm[]>) => {
                return res.body;
            });
    }

    getAttackCostParams(self: SelfAssessmentMgm): Observable<AttackCostParamMgm[]> {
        return this.http.get<AttackCostParamMgm[]>(
            this.attackCostParamsUrl.replace('{selfAssessmentID}', String(self.id)),
            { observe: 'response' })
            .map((res: HttpResponse<AttackCostParamMgm[]>) => {
                return res.body;
            });
    }

    getStatus(self: SelfAssessmentMgm): Observable<ImpactEvaluationStatus> {
        return this.http.get<ImpactEvaluationStatus>(
            this.wp3StatusUrl.replace('{selfAssessmentID}', String(self.id)),
            { observe: 'response' })
            .map((res: HttpResponse<ImpactEvaluationStatus>) => {
                return res.body;
            });
    }

    getMyAssets(self: SelfAssessmentMgm): Observable<MyAssetMgm[]> {
        const uri = this.assetServiceUrl + self.id.toString();
        return this.http.get<MyAssetMgm[]>(uri, { observe: 'response' })
            .map((res: HttpResponse<MyAssetMgm[]>) => {
                return res.body;
            });
    }

    evaluateStepOne(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
        return this.http.post<Wp3BundleOutput>(
            this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepOne,
            bundle,
            { observe: 'response' })
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
    }

    evaluateStepTwo(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
        return this.http.post<Wp3BundleOutput>(
            this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepTwo,
            bundle,
            { observe: 'response' })
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
    }

    evaluateStepThree(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
        return this.http.post<Wp3BundleOutput>(
            this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepThree,
            bundle,
            { observe: 'response' })
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
    }

    evaluateStepFour(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
        return this.http.post<Wp3BundleOutput>(
            this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepFour,
            bundle,
            { observe: 'response' })
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
    }

    evaluateStepFive(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
        return this.http.post<Wp3BundleOutput>(
            this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepFive,
            bundle,
            { observe: 'response' })
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
    }

    evaluateMyAssetsEconomicLosses(self: SelfAssessmentMgm): Observable<MyAssetMgm[]> {
        return this.http.get<MyAssetMgm[]>(this.wp3ServiceUrl.replace('{selfAssessmentID}', self.id + '') + this.myAssetsEconomicLossesEvaluationStep, { observe: 'response' })
            .map((res: HttpResponse<MyAssetMgm[]>) => {
                return res.body;
            });
    }
}
