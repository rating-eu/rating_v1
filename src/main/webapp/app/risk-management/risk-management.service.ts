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

import {MyAssetRisk} from './model/my-asset-risk.model';
import {MyAssetMgm} from './../entities/my-asset-mgm/my-asset-mgm.model';
import {Injectable} from '@angular/core';
import {Observable, Subject} from '../../../../../node_modules/rxjs';
import {SERVER_API_URL} from '../app.constants';
import {SelfAssessmentMgm} from '../entities/self-assessment-mgm';
import {CriticalLevelMgm} from '../entities/critical-level-mgm';
import {HttpClient, HttpResponse, HttpErrorResponse} from '../../../../../node_modules/@angular/common/http';
import {MyAssetAttackChance} from './model/my-asset-attack-chance.model';
import {AttackCostFormula} from './model/attack-cost-formula.model';

@Injectable()
export class RiskManagementService {
    private criticalLevelServiceUrl = SERVER_API_URL + 'api/critical-levels/self-assessment/';
    private assetServiceUrl = SERVER_API_URL + 'api/my-assets/self-assessment/';
    private attackChanceServiceUrl = SERVER_API_URL + 'api/{selfAssessmentID}/wp4/my-assets/{myAssetID}/attack-chances/';
    private attackCostsFormulaByMyAssetUrl = SERVER_API_URL + '/api/{selfAssessmentID}/formula/attack-costs/{myAssetID}';
    private impactFormulaByMyAssetUrl = SERVER_API_URL + '/api/{selfAssessmentID}/formula/impact/{myAssetID}';
    private assetsAtRiskUrl = SERVER_API_URL + 'api/{selfAssessmentID}/wp4/my-asset-risks';
    private subscriptorForCriticalLevel: Subject<CriticalLevelMgm> = new Subject<CriticalLevelMgm>();

    constructor(
        private http: HttpClient
    ) {
    }

    public subscribeForCriticalLevel(): Observable<CriticalLevelMgm> {
        return this.subscriptorForCriticalLevel.asObservable();
    }

    public sendUpdateForCriticalLevelToSubscriptor(level: CriticalLevelMgm) {
        this.subscriptorForCriticalLevel.next(level);
    }

    public getMyAssetsAtRisk(self: SelfAssessmentMgm): Observable<MyAssetRisk[]> {
        const uri = this.assetsAtRiskUrl.replace('{selfAssessmentID}', String(self.id));
        return this.http.get<MyAssetRisk[]>(uri, {observe: 'response'})
            .map((res: HttpResponse<MyAssetRisk[]>) => {
                return res.body;
            }).catch((err: HttpErrorResponse) => {
                return Observable.empty<MyAssetRisk[]>();
            });
    }

    public getImpactFormulaByMyAsset(self: SelfAssessmentMgm, myAsset: MyAssetMgm): Observable<string> {
        const uri = this.impactFormulaByMyAssetUrl.replace('{selfAssessmentID}', String(self.id)).replace('{myAssetID}', String(myAsset.id));
        return this.http.get(uri, {responseType: 'text'})
            .map((res) => {
                return res;
            }).catch((err) => {
                return Observable.empty<string>();
            });
    }

    public getAttackCostsFormulaByMyAsset(self: SelfAssessmentMgm, myAsset: MyAssetMgm): Observable<AttackCostFormula[]> {
        const uri = this.attackCostsFormulaByMyAssetUrl.replace('{selfAssessmentID}', String(self.id)).replace('{myAssetID}', String(myAsset.id));
        return this.http.get<AttackCostFormula[]>(uri, {observe: 'response'})
            .map((res: HttpResponse<AttackCostFormula[]>) => {
                return res.body;
            }).catch((err: HttpErrorResponse) => {
                return Observable.empty<AttackCostFormula[]>();
            });
    }

    public getCriticalLevel(self: SelfAssessmentMgm): Observable<CriticalLevelMgm> {
        const uri = this.criticalLevelServiceUrl + self.id.toString();
        return this.http.get<CriticalLevelMgm>(uri, {observe: 'response'})
            .map((res: HttpResponse<CriticalLevelMgm>) => {
                return res.body;
            }).catch((err: HttpErrorResponse) => {
                return Observable.empty<CriticalLevelMgm>();
            });
    }

    public getMyAssets(self: SelfAssessmentMgm): Observable<MyAssetMgm[]> {
        const uri = this.assetServiceUrl + self.id.toString();
        return this.http.get<MyAssetMgm[]>(uri, {observe: 'response'})
            .map((res: HttpResponse<MyAssetMgm[]>) => {
                return res.body;
            });
    }

    public getAttackChance(myAsset: MyAssetMgm, self: SelfAssessmentMgm): Observable<MyAssetAttackChance[]> {
        const uri = this.attackChanceServiceUrl.replace('{selfAssessmentID}', String(self.id)).replace('{myAssetID}', String(myAsset.id));
        return this.http.get<MyAssetAttackChance[]>(uri, {observe: 'response'})
            .map((res: HttpResponse<MyAssetAttackChance[]>) => {
                return res.body;
            });
    }

    public whichLevel(row: number, column: number, criticalLevel: CriticalLevelMgm): string {
        const level = row * column;
        if (level <= criticalLevel.lowLimit) {
            return 'low';
        } else if (level > criticalLevel.lowLimit && level <= criticalLevel.mediumLimit) {
            return 'medium';
        } else if (level > criticalLevel.mediumLimit && level <= criticalLevel.highLimit) {
            return 'high';
        } else if (criticalLevel.mediumLimit === undefined && level <= criticalLevel.highLimit) {
            return 'high';
        } else if (criticalLevel.lowLimit === undefined && level <= criticalLevel.mediumLimit) {
            return 'medium';
        } else {
            return 'undefined';
        }
    }
}
